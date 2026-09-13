import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getRows, updateRow, appendRow, SHEET_TABS } from '@/lib/google/sheets';
import { deleteEvent, updateEvent } from '@/lib/google/calendar';

/**
 * POST /api/sync/sheets
 * Bidirectional Sync Endpoint:
 * Handles incoming webhooks from Google Apps Script (onEdit) and Supabase Edge Functions.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, tabName, rowNumber, rowData, table, record, type } = body;

    // ─────────────────────────────────────────────────────────────────────────────
    // CASE 1: Incoming from Google Apps Script (Owner edited a cell in Google Sheets)
    // ─────────────────────────────────────────────────────────────────────────────
    if (action === 'sheet_cell_edited' || action === 'sheets_edit') {
      console.log(`[Sheets Sync] Row edit received in tab: ${tabName}, row: ${rowNumber}`);

      if (tabName === SHEET_TABS.BOOKINGS && rowData) {
        const [
          bookingId,
          patientName,
          phone,
          email,
          dateStr,
          timeStr,
          visitType,
          status,
          notes,
        ] = rowData;

        if (bookingId) {
          // Normalize status
          let normalizedStatus = 'scheduled';
          const s = String(status || '').trim().toLowerCase();
          if (s.includes('مكتمل') || s.includes('completed')) normalizedStatus = 'completed';
          else if (s.includes('ملغي') || s.includes('cancelled')) normalizedStatus = 'cancelled';
          else if (s.includes('لم يحضر') || s.includes('no_show')) normalizedStatus = 'no_show';
          else normalizedStatus = 'scheduled';

          // Fetch current appointment to check if status or calendar needs update
          const { data: currentApp } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', bookingId)
            .single();

          if (currentApp) {
            // Update Supabase
            await supabase
              .from('appointments')
              .update({
                status: normalizedStatus,
                notes: notes || currentApp.notes,
                sheet_row_number: rowNumber,
                updated_at: new Date().toISOString(),
              })
              .eq('id', bookingId);

            // If cancelled, delete from Google Calendar & cancel reminder jobs
            if (normalizedStatus === 'cancelled' && currentApp.google_event_id) {
              try {
                await deleteEvent({ eventId: currentApp.google_event_id });
              } catch (calErr) {
                console.warn('[Calendar Delete Error]', calErr);
              }

              await supabase
                .from('reminder_jobs')
                .update({ status: 'cancelled' })
                .eq('appointment_id', bookingId)
                .eq('sent', false);
            }
          }
        }
      } else if (tabName === SHEET_TABS.PATIENTS && rowData) {
        const [
          patientId,
          fullName,
          phone,
          email,
          birthDate,
          gender,
          bloodType,
          allergies,
          chronicDiseases,
          currentMedications,
          lastVisit,
          visitCount,
          medicalNotes,
        ] = rowData;

        if (patientId || email) {
          await supabase.from('patients').upsert({
            ...(patientId ? { id: patientId } : {}),
            full_name: fullName,
            phone,
            email,
            birth_date: birthDate || null,
            gender: gender === 'ذكر' ? 'male' : gender === 'أنثى' ? 'female' : null,
            blood_type: bloodType || null,
            allergies,
            chronic_diseases: chronicDiseases,
            current_medications: currentMedications,
            medical_notes: medicalNotes,
            sheet_row_number: rowNumber,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
        }
      } else if (tabName === SHEET_TABS.SETTINGS && rowData) {
        const [key, value] = rowData;
        if (key && value) {
          await supabase.from('clinic_settings').upsert({
            key: String(key).trim(),
            value: String(value).trim(),
            updated_at: new Date().toISOString(),
          });
        }
      }

      return NextResponse.json({ success: true, message: 'Synced from Sheets to Supabase' });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CASE 2: Incoming from Supabase DB Webhook (Site or DB changed -> Sync to Sheets)
    // ─────────────────────────────────────────────────────────────────────────────
    if (action === 'db_webhook' || table) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nabd-nursing.vercel.app';

      if (table === 'appointments') {
        const app = record;
        const d = new Date(app.start_at);
        const dateStr = d.toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo' });
        const timeStr = d.toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' });
        const updatedStr = new Date(app.updated_at || app.created_at).toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });

        const values = [
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

        if (app.sheet_row_number) {
          await updateRow({
            tabName: SHEET_TABS.BOOKINGS,
            rowNumber: app.sheet_row_number,
            values,
          });
        } else {
          const res = await appendRow({
            tabName: SHEET_TABS.BOOKINGS,
            values,
          });
          if (res.rowNumber) {
            await supabase.from('appointments').update({ sheet_row_number: res.rowNumber }).eq('id', app.id);
          }
        }
      } else if (table === 'patients') {
        const p = record;
        const values = [
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
        ];

        if (p.sheet_row_number) {
          await updateRow({
            tabName: SHEET_TABS.PATIENTS,
            rowNumber: p.sheet_row_number,
            values,
          });
        } else {
          const res = await appendRow({
            tabName: SHEET_TABS.PATIENTS,
            values,
          });
          if (res.rowNumber) {
            await supabase.from('patients').update({ sheet_row_number: res.rowNumber }).eq('id', p.id);
          }
        }
      } else if (table === 'blood_requests') {
        const b = record;
        const values = [
          b.id,
          b.patient_name || b.requester_name || b.name || 'مجهول',
          b.phone || '',
          b.blood_type,
          b.request_type === 'donate' ? 'تبرع' : 'طلب دم',
          b.location || b.hospital || '',
          b.status,
          new Date(b.created_at).toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo' }),
          b.notes || '',
        ];

        if (b.sheet_row_number) {
          await updateRow({
            tabName: SHEET_TABS.BLOOD_BANK,
            rowNumber: b.sheet_row_number,
            values,
          });
        } else {
          const res = await appendRow({
            tabName: SHEET_TABS.BLOOD_BANK,
            values,
          });
          if (res.rowNumber) {
            await supabase.from('blood_requests').update({ sheet_row_number: res.rowNumber }).eq('id', b.id);
          }
        }
      }

      return NextResponse.json({ success: true, message: 'Synced from DB to Sheets' });
    }

    return NextResponse.json({ message: 'No action performed' });
  } catch (err: any) {
    console.error('[Sheets Webhook Exception]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
