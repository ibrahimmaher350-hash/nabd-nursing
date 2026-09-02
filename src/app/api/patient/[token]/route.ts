import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbxBR6fJaq5_9yOGh7ISdEOL1tQNvmyf6R0HQ6m2cIU4mlQjNUoLYNxs2QPjCeoRamJSpg/exec'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  
  if (!token) {
    return NextResponse.json({ success: false, message: 'Missing token' }, { status: 400 })
  }

  try {
    const res = await fetch(`${DEFAULT_SHEETS_URL}?action=getPatientByToken&token=${token}`, {
      method: 'GET',
      cache: 'no-store'
    })
    
    if (res.ok) {
      const data = await res.json()
      
      if (data.success && data.data) {
        // Strip sensitive internal data from the response to be extra safe
        // e.g. internal admin notes or identifiers
        
        const safeData = {
          patient: {
            patient_id: data.data.patient.patient_id,
            patient_name: data.data.patient.patient_name,
            city: data.data.patient.city,
            status: data.data.patient.status,
            registration_date: data.data.patient.registration_date,
          },
          visits: data.data.visits || [],
          vitals: data.data.vitals || [],
          medications: data.data.medications || [],
          labs: data.data.labs || [],
          instructions: (data.data.instructions || []).filter((i: any) => String(i.active).toLowerCase() === 'true' || i.active === true || i.active === 1 || i.active === 'TRUE' || i.active === ''),
        }
        
        return NextResponse.json({ success: true, data: safeData })
      } else {
        return NextResponse.json({ success: false, message: 'Patient not found or invalid token' }, { status: 404 })
      }
    }
    throw new Error('Failed to fetch from Google Sheets')
  } catch (error) {
    console.error('[API/PublicPatient] GET Error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
