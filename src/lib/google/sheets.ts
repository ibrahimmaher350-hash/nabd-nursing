/**
 * src/lib/google/sheets.ts
 * Google Sheets REST API Client & Bidirectional Sync Engine for Nabd Clinic.
 * 
 * Manages the 5 Control Panel Tabs:
 * 1. "الحجوزات" (Bookings & Appointments)
 * 2. "ملفات المرضى" (Patient Profiles & Medical Records)
 * 3. "بنك الدم" (Blood Bank Requests & Donor Matches)
 * 4. "التذكيرات" (Reminders Dispatch Log)
 * 5. "الإعدادات" (Clinic Configuration)
 * 
 * ASSUMPTION: Timezone is 'Africa/Cairo'.
 * ASSUMPTION: Google Sheet ID is provided in GOOGLE_SHEET_ID.
 */

import { supabase } from '@/lib/supabase/client';
import { decryptToken } from '@/lib/crypto';
import { refreshGoogleAccessToken } from './calendar-and-sheets';

export const DEFAULT_GOOGLE_SHEET_ID = '19Xv5QOgi0Qn78Q6ypv6PM7sU74khLEtHy7T49T_vUjo';

export const SHEET_TABS = {
  BOOKINGS: 'الحجوزات',
  PATIENTS: 'ملفات المرضى',
  BLOOD_BANK: 'بنك الدم',
  REMINDERS: 'التذكيرات',
  SETTINGS: 'الإعدادات',
} as const;

export const TAB_HEADERS = {
  [SHEET_TABS.BOOKINGS]: [
    'رقم_الحجز',
    'اسم_المريض',
    'الهاتف',
    'البريد',
    'التاريخ',
    'الوقت',
    'نوع_الزيارة',
    'الحالة',
    'ملاحظات',
    'رابط_الموعد',
    'آخر_تحديث',
  ],
  [SHEET_TABS.PATIENTS]: [
    'رقم_المريض',
    'الاسم_الكامل',
    'الهاتف',
    'البريد',
    'تاريخ_الميلاد',
    'الجنس',
    'فصيلة_الدم',
    'الحساسية',
    'أمراض_مزمنة',
    'أدوية_حالية',
    'آخر_زيارة',
    'عدد_الزيارات',
    'ملاحظات_طبية',
    'تاريخ_إنشاء_الملف',
  ],
  [SHEET_TABS.BLOOD_BANK]: [
    'رقم_الطلب',
    'اسم_المتبرع/المحتاج',
    'الهاتف',
    'فصيلة_الدم',
    'النوع_(طلب/تبرع)',
    'الموقع',
    'الحالة',
    'التاريخ',
    'ملاحظات',
  ],
  [SHEET_TABS.REMINDERS]: [
    'رقم_التذكير',
    'رقم_الحجز',
    'اسم_المريض',
    'البريد',
    'نوع_التذكير_(24h/1h)',
    'موعد_الإرسال',
    'الحالة_(pending/sent/failed)',
    'وقت_الإرسال_الفعلي',
    'خطأ_(إن_وجد)',
  ],
  [SHEET_TABS.SETTINGS]: [
    'المفتاح',
    'القيمة',
  ],
};

/**
 * Retrieves an active access token using the stored refresh token from the database
 */
export async function getValidAccessToken(): Promise<string> {
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('google_refresh_token')
    .eq('role', 'admin')
    .not('google_refresh_token', 'is', null)
    .limit(1)
    .single();

  if (!adminProfile?.google_refresh_token) {
    throw new Error('Google refresh token is not connected yet. Please connect Google Account from /dashboard');
  }

  const decryptedToken = decryptToken(adminProfile.google_refresh_token);
  return refreshGoogleAccessToken(decryptedToken);
}

/**
 * Appends a row of values to a specific tab in Google Sheets
 */
export async function appendRow({
  tabName,
  values,
  sheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_GOOGLE_SHEET_ID,
  accessToken,
}: {
  tabName: string;
  values: any[];
  sheetId?: string;
  accessToken?: string;
}): Promise<{ success: boolean; rowNumber?: number }> {
  if (!sheetId) throw new Error('GOOGLE_SHEET_ID is missing');
  const token = accessToken || (await getValidAccessToken());

  const range = `${encodeURIComponent(tabName)}!A1`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [values],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error(`[Sheets Error] Failed to append to ${tabName}:`, data);
    throw new Error(data.error?.message || 'Failed to append row in Google Sheets');
  }

  // Extract updated row index from updatedRange (e.g. "'الحجوزات'!A15:K15")
  let rowNumber: number | undefined;
  if (data.updates?.updatedRange) {
    const match = data.updates.updatedRange.match(/!A(\d+):/);
    if (match && match[1]) {
      rowNumber = parseInt(match[1], 10);
    }
  }

  return { success: true, rowNumber };
}

/**
 * Updates a specific row number in a given tab
 */
export async function updateRow({
  tabName,
  rowNumber,
  values,
  sheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_GOOGLE_SHEET_ID,
  accessToken,
}: {
  tabName: string;
  rowNumber: number;
  values: any[];
  sheetId?: string;
  accessToken?: string;
}): Promise<boolean> {
  if (!sheetId) throw new Error('GOOGLE_SHEET_ID is missing');
  const token = accessToken || (await getValidAccessToken());

  const range = `${encodeURIComponent(tabName)}!A${rowNumber}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${range}?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [values],
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    console.error(`[Sheets Error] Failed to update row ${rowNumber} in ${tabName}:`, data);
    return false;
  }

  return true;
}

/**
 * Reads all rows from a tab or specific range
 */
export async function getRows({
  tabName,
  range = 'A1:Z500',
  sheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_GOOGLE_SHEET_ID,
  accessToken,
}: {
  tabName: string;
  range?: string;
  sheetId?: string;
  accessToken?: string;
}): Promise<any[][]> {
  if (!sheetId) throw new Error('GOOGLE_SHEET_ID is missing');
  const token = accessToken || (await getValidAccessToken());

  const fullRange = `${encodeURIComponent(tabName)}!${range}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${fullRange}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.error(`[Sheets Error] Failed to read ${tabName}:`, data);
    return [];
  }

  return data.values || [];
}

/**
 * Finds a row index by looking for a value in a specific column (0-indexed)
 */
export async function findRowByValue({
  tabName,
  columnIndex = 0,
  value,
  sheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_GOOGLE_SHEET_ID,
  accessToken,
}: {
  tabName: string;
  columnIndex?: number;
  value: string;
  sheetId?: string;
  accessToken?: string;
}): Promise<number | null> {
  const rows = await getRows({ tabName, sheetId, accessToken });
  for (let i = 1; i < rows.length; i++) {
    if (rows[i] && String(rows[i][columnIndex]).trim() === String(value).trim()) {
      return i + 1; // 1-indexed row number in Google Sheets
    }
  }
  return null;
}

/**
 * Ensures the Google Sheet has all 5 tabs and sets row 1 frozen headers
 */
export async function initializeSheetTabsAndHeaders({
  sheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_GOOGLE_SHEET_ID,
  accessToken,
}: {
  sheetId?: string;
  accessToken?: string;
} = {}): Promise<{ success: boolean; message: string }> {
  if (!sheetId) throw new Error('GOOGLE_SHEET_ID is missing');
  const token = accessToken || (await getValidAccessToken());

  // 1. Fetch spreadsheet metadata to see existing sheets
  const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}`;
  const metaRes = await fetch(metaUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const metaData = await metaRes.json();

  if (!metaRes.ok) {
    console.error('[Sheets Error] Metadata fetch failed:', metaData);
    return { success: false, message: metaData?.error?.message || 'Failed to fetch spreadsheet' };
  }

  const existingSheetTitles: string[] = (metaData.sheets || []).map(
    (s: any) => s.properties?.title
  );

  // 2. Create missing tabs
  const requests: any[] = [];
  for (const tab of Object.values(SHEET_TABS)) {
    if (!existingSheetTitles.includes(tab)) {
      requests.push({
        addSheet: {
          properties: {
            title: tab,
            rightToLeft: true, // RTL for Arabic
            gridProperties: {
              frozenRowCount: 1, // Freeze header row
            },
          },
        },
      });
    }
  }

  if (requests.length > 0) {
    const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}:batchUpdate`;
    await fetch(batchUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });
  }

  // 3. Set header rows for each tab
  for (const [tab, headers] of Object.entries(TAB_HEADERS)) {
    const headerRange = `${encodeURIComponent(tab)}!A1:${String.fromCharCode(64 + headers.length)}1`;
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${headerRange}?valueInputOption=USER_ENTERED`;
    await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [headers],
      }),
    });
  }

  return { success: true, message: 'All tabs initialized successfully with Arabic headers' };
}

/**
 * Full One-Click Sync: Exports all Supabase tables into Google Sheets tabs
 */
export async function syncAllTabsFromSupabase(): Promise<{
  success: boolean;
  bookingsCount: number;
  patientsCount: number;
  bloodCount: number;
  remindersCount: number;
}> {
  const token = await getValidAccessToken();
  const sheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error('GOOGLE_SHEET_ID is missing');

  // Ensure tabs and headers
  await initializeSheetTabsAndHeaders({ sheetId, accessToken: token });

  // 1. Fetch data from Supabase
  const [
    { data: appointments },
    { data: patients },
    { data: bloodRequests },
    { data: reminderJobs },
    { data: clinicSettings },
  ] = await Promise.all([
    supabase.from('appointments').select('*').order('start_at', { ascending: false }),
    supabase.from('patients').select('*').order('created_at', { ascending: false }),
    supabase.from('blood_requests').select('*').order('created_at', { ascending: false }),
    supabase.from('reminder_jobs').select('*, appointments(patient_name, patient_email)').order('fire_at', { ascending: false }),
    supabase.from('clinic_settings').select('*'),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nabd-nursing.vercel.app';

  // Format Bookings rows
  const bookingRows = (appointments || []).map((app) => {
    const d = new Date(app.start_at);
    const dateStr = d.toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo' });
    const timeStr = d.toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' });
    const updatedStr = new Date(app.updated_at || app.created_at).toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });

    return [
      app.id,
      app.patient_name,
      app.patient_phone,
      app.patient_email,
      dateStr,
      timeStr,
      app.visit_type,
      app.status,
      app.notes || '',
      app.meet_link || `${siteUrl}/appointments/${app.id}/manage`,
      updatedStr,
    ];
  });

  // Format Patients rows
  const patientRows = (patients || []).map((p) => [
    p.id,
    p.full_name,
    p.phone || '',
    p.email || '',
    p.birth_date || '',
    p.gender === 'male' ? 'ذكر' : p.gender === 'female' ? 'أنثى' : '',
    p.blood_type || '',
    p.allergies || 'لا يوجد',
    p.chronic_diseases || 'لا يوجد',
    p.current_medications || 'لا يوجد',
    p.last_visit ? new Date(p.last_visit).toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo' }) : '',
    p.visit_count || 0,
    p.medical_notes || '',
    new Date(p.created_at).toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo' }),
  ]);

  // Format Blood Bank rows
  const bloodRows = (bloodRequests || []).map((b) => [
    b.id,
    b.patient_name || b.requester_name || b.name || 'مجهول',
    b.phone || '',
    b.blood_type,
    b.request_type === 'donate' ? 'تبرع' : 'طلب دم',
    b.location || b.hospital || '',
    b.status,
    new Date(b.created_at).toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo' }),
    b.notes || '',
  ]);

  // Format Reminders rows
  const reminderRows = (reminderJobs || []).map((r: any) => [
    r.id,
    r.appointment_id,
    r.appointments?.patient_name || '',
    r.appointments?.patient_email || '',
    r.kind,
    new Date(r.fire_at).toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
    r.status || (r.sent ? 'sent' : 'pending'),
    r.sent ? new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }) : '',
    r.error_message || '',
  ]);

  // Format Settings rows
  const settingsRows = (clinicSettings || []).map((s) => [s.key, s.value]);

  // Batch update all data
  const dataUpdates = [
    {
      range: `${encodeURIComponent(SHEET_TABS.BOOKINGS)}!A2:K${Math.max(2, bookingRows.length + 1)}`,
      values: bookingRows.length > 0 ? bookingRows : [['']],
    },
    {
      range: `${encodeURIComponent(SHEET_TABS.PATIENTS)}!A2:N${Math.max(2, patientRows.length + 1)}`,
      values: patientRows.length > 0 ? patientRows : [['']],
    },
    {
      range: `${encodeURIComponent(SHEET_TABS.BLOOD_BANK)}!A2:I${Math.max(2, bloodRows.length + 1)}`,
      values: bloodRows.length > 0 ? bloodRows : [['']],
    },
    {
      range: `${encodeURIComponent(SHEET_TABS.REMINDERS)}!A2:I${Math.max(2, reminderRows.length + 1)}`,
      values: reminderRows.length > 0 ? reminderRows : [['']],
    },
    {
      range: `${encodeURIComponent(SHEET_TABS.SETTINGS)}!A2:B${Math.max(2, settingsRows.length + 1)}`,
      values: settingsRows.length > 0 ? settingsRows : [['']],
    },
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: dataUpdates,
    }),
  });

  return {
    success: true,
    bookingsCount: bookingRows.length,
    patientsCount: patientRows.length,
    bloodCount: bloodRows.length,
    remindersCount: reminderRows.length,
  };
}

export const fullSyncToSheets = syncAllTabsFromSupabase;

