/**
 * app/api/facebook-catalog/route.ts — نبض للتمريض المنزلي
 * Meta (Facebook) Services Catalog Feed.
 * 
 * Contains exclusively the 15 official services from:
 * https://nabd-nursing.vercel.app/services
 * 
 * Supports:
 * - XML RSS 2.0 / Google Merchant & Facebook Catalog standard feed (Default)
 * - CSV format via ?format=csv
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { services } from '@/data/services'
import { siteConfig } from '@/data/siteConfig'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://nabd-nursing.vercel.app'

function sanitizeXml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getSavedSettings() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'dynamicSettings.json')
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
  } catch {}
  return null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format')
  const dynSettings = getSavedSettings()

  // ── Build the exact list of 15 services from /services ──
  const catalogItems = services.map((srv) => {
    const isSupplies = srv.id === 'medical-supplies'
    const srvOverride = dynSettings?.servicesOverrides?.[srv.id]
    const vivaOverride = dynSettings?.suppliesOverrides?.['vivachek-ino']

    // Pricing
    let priceStr = '150.00 EGP'
    let salePriceStr = '150.00 EGP'

    if (isSupplies) {
      const saleNum = parseInt((vivaOverride?.price || '450').replace(/[^0-9]/g, '')) || 450
      const regNum = parseInt((vivaOverride?.oldPrice || '650').replace(/[^0-9]/g, '')) || 650
      priceStr = `${regNum}.00 EGP`
      salePriceStr = `${saleNum}.00 EGP`
    } else if (srvOverride?.price) {
      const num = parseInt(srvOverride.price.replace(/[^0-9]/g, '')) || 150
      priceStr = `${num}.00 EGP`
      salePriceStr = `${num}.00 EGP`
    }

    // Image link
    const imageLink = isSupplies
      ? `${BASE_URL}/vivachek.png`
      : `${BASE_URL}/og-image.jpg`

    return {
      id: srv.slug,
      title: `${srv.name} — نبض للتمريض المنزلي بدمياط`,
      description: `${srv.description} ${srv.shortDescription} متوفر لجميع مناطق دمياط مع كادر تمريض مؤهل.`,
      link: `${BASE_URL}/services/${srv.slug}`,
      image_link: imageLink,
      brand: 'نبض للتمريض المنزلي',
      condition: 'new',
      availability: 'in stock',
      price: priceStr,
      sale_price: salePriceStr,
      google_product_category: isSupplies
        ? 'Health & Beauty > Health Care > Medical Supplies'
        : 'Health & Beauty > Health Care > Home Health Care Services',
      product_type: `خدمات تمريضية منزلية > ${srv.category}`,
      custom_label_0: srv.category,
      custom_label_1: 'دمياط',
    }
  })

  // ── CSV Export ──
  if (format === 'csv') {
    const headers = [
      'id',
      'title',
      'description',
      'link',
      'image_link',
      'brand',
      'condition',
      'availability',
      'price',
      'sale_price',
      'google_product_category',
      'product_type',
      'custom_label_0',
      'custom_label_1',
    ]

    const csvRows = [
      headers.join(','),
      ...catalogItems.map((it) =>
        [
          `"${it.id}"`,
          `"${it.title.replace(/"/g, '""')}"`,
          `"${it.description.replace(/"/g, '""')}"`,
          `"${it.link}"`,
          `"${it.image_link}"`,
          `"${it.brand}"`,
          `"${it.condition}"`,
          `"${it.availability}"`,
          `"${it.price}"`,
          `"${it.sale_price}"`,
          `"${it.google_product_category}"`,
          `"${it.product_type}"`,
          `"${it.custom_label_0}"`,
          `"${it.custom_label_1}"`,
        ].join(',')
      ),
    ]

    return new NextResponse(csvRows.join('\n'), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'inline; filename="nabd-services-catalog.csv"',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    })
  }

  // ── XML RSS 2.0 / Google Merchant Feed (Default) ──
  const xmlItems = catalogItems
    .map(
      (it) => `
    <item>
      <g:id>${sanitizeXml(it.id)}</g:id>
      <g:title>${sanitizeXml(it.title)}</g:title>
      <g:description>${sanitizeXml(it.description)}</g:description>
      <g:link>${sanitizeXml(it.link)}</g:link>
      <g:image_link>${sanitizeXml(it.image_link)}</g:image_link>
      <g:brand>${sanitizeXml(it.brand)}</g:brand>
      <g:condition>${sanitizeXml(it.condition)}</g:condition>
      <g:availability>${sanitizeXml(it.availability)}</g:availability>
      <g:price>${sanitizeXml(it.price)}</g:price>
      <g:sale_price>${sanitizeXml(it.sale_price)}</g:sale_price>
      <g:google_product_category>${sanitizeXml(it.google_product_category)}</g:google_product_category>
      <g:product_type>${sanitizeXml(it.product_type)}</g:product_type>
      <g:custom_label_0>${sanitizeXml(it.custom_label_0)}</g:custom_label_0>
      <g:custom_label_1>${sanitizeXml(it.custom_label_1)}</g:custom_label_1>
    </item>`
    )
    .join('')

  const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${sanitizeXml(siteConfig.brand.name)} — كتالوج الخدمات التمريضية</title>
    <link>${BASE_URL}/services</link>
    <description>${sanitizeXml(siteConfig.brand.description)}</description>
    ${xmlItems}
  </channel>
</rss>`

  return new NextResponse(xmlFeed, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
