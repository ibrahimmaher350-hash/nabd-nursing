import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbxBR6fJaq5_9yOGh7ISdEOL1tQNvmyf6R0HQ6m2cIU4mlQjNUoLYNxs2QPjCeoRamJSpg/exec'

export const dynamic = 'force-dynamic'

function isAuthenticated(req: NextRequest) {
  const pin = req.headers.get('x-admin-pin')
  return pin === '2026' || pin === '01001097896'
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await fetch(`${DEFAULT_SHEETS_URL}?action=getAllPatients`, {
      method: 'GET',
      cache: 'no-store'
    })
    
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
    throw new Error('Failed to fetch from Google Sheets')
  } catch (error) {
    console.error('[API/Patients] GET Error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const payload = {
      action: 'create_patient',
      data: body
    }

    const res = await fetch(DEFAULT_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
    throw new Error('Failed to create patient in Google Sheets')
  } catch (error) {
    console.error('[API/Patients] POST Error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
