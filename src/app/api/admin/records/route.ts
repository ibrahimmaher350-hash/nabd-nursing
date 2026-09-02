import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbxBR6fJaq5_9yOGh7ISdEOL1tQNvmyf6R0HQ6m2cIU4mlQjNUoLYNxs2QPjCeoRamJSpg/exec'

export const dynamic = 'force-dynamic'

function isAuthenticated(req: NextRequest) {
  const pin = req.headers.get('x-admin-pin')
  return pin === '2026' || pin === '01001097896'
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action, data, sheet, id_field, id_value } = body
    
    // Validate action
    const allowedActions = ['add_visit', 'add_vital', 'add_medication', 'add_instruction', 'add_lab', 'delete_record']
    if (!allowedActions.includes(action)) {
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 })
    }

    const payload = {
      action,
      data,
      sheet,
      id_field,
      id_value
    }

    const res = await fetch(DEFAULT_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (res.ok) {
      const responseData = await res.json()
      return NextResponse.json(responseData)
    }
    throw new Error(`Failed to execute ${action} in Google Sheets`)
  } catch (error) {
    console.error('[API/Records] POST Error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
