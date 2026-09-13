/**
 * scripts/scheduleNextVisit.js
 * Schedules a test visit for tomorrow in Supabase and syncs to Google Sheets webhook.
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obaccodbtcaxjmkaxeye.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iYWNjb2RidGNheGpta2F4ZXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyOTIwMjMsImV4cCI6MjEwNDg2ODAyM30.mLcN7KkfZ8l0StujzEeOS8cB90kU80Sxp4SvzkhPPwY';
const sheetsWebhook = 'https://script.google.com/macros/s/AKfycbxBR6fJaq5_9yOGh7ISdEOL1tQNvmyf6R0HQ6m2cIU4mlQjNUoLYNxs2QPjCeoRamJSpg/exec';

async function run() {
  console.log('Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Set next visit for tomorrow at 11:00 AM Cairo time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];
  const startAt = `${dateStr}T11:00:00+02:00`;
  const endAt = `${dateStr}T12:00:00+02:00`;

  const newAppointment = {
    patient_name: 'إبراهيم ماهر (زيارة متابعة)',
    patient_phone: '01099667065',
    patient_email: 'maher@nabd.eg',
    title: 'متابعة وتمريض منزلي — فحص دوري',
    visit_type: 'nursing_care',
    start_at: startAt,
    end_at: endAt,
    location: 'دمياط — حي الأعصر',
    notes: 'فحص ضغط وسكر وغيار جروح دوري معتمد',
    status: 'scheduled',
  };

  console.log('Inserting appointment into Supabase...', newAppointment.title);
  const { data, error } = await supabase
    .from('appointments')
    .insert([newAppointment])
    .select()
    .single();

  if (error) {
    console.warn('Supabase insert note (if table pending migration):', error.message);
  } else {
    console.log('Appointment created in Supabase with ID:', data.id);
  }

  // Send to Google Sheets Webhook using active action 'add_visit'
  console.log('Syncing to Google Sheets webhook via add_visit...');
  try {
    const bookingId = data?.id || `NABD-${Date.now().toString().slice(-6)}`;
    const res = await fetch(sheetsWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_visit',
        data: {
          patient_id: bookingId,
          patient_name: newAppointment.patient_name,
          date: dateStr,
          time: '11:00 ص',
          service: newAppointment.title,
          nurse: 'إبراهيم ماهر (تمريض نبض)',
          status: 'مؤكدة ومجدولة',
          notes: `المكان: ${newAppointment.location} | الهاتف: ${newAppointment.patient_phone} | ${newAppointment.notes}`,
        },
      }),
    });

    console.log('Google Sheets Webhook Response Status:', res.status);
    const text = await res.text();
    console.log('Webhook output:', text);
  } catch (err) {
    console.warn('Webhook exception:', err.message);
  }

  console.log('Done!');
}

run();
