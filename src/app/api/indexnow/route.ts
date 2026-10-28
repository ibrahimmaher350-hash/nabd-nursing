import { NextResponse } from 'next/server'
import { services } from '@/data/services'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nabd-nursing.vercel.app'
const KEY = 'c8f1e29d4b7a3056e91f8c2a4d3b5e71'

export async function GET() {
  const urlList = [
    `${BASE_URL}/`,
    `${BASE_URL}/services`,
    `${BASE_URL}/booking`,
    `${BASE_URL}/medical-guide`,
    `${BASE_URL}/reviews`,
    `${BASE_URL}/about`,
    `${BASE_URL}/contact`,
    ...services.filter((s) => s.active).map((s) => `${BASE_URL}/services/${s.slug}`),
  ]

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: 'nabd-nursing.vercel.app',
        key: KEY,
        keyLocation: `${BASE_URL}/${KEY}.txt`,
        urlList,
      }),
    })

    return NextResponse.json({
      success: true,
      status: res.status,
      submittedUrls: urlList.length,
      message: 'IndexNow submitted successfully to Bing & search engines',
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
