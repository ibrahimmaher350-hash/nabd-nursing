/**
 * app/api/facebook-catalog/route.ts — نبض للتمريض المنزلي
 * Meta (Facebook) Commerce & Services Catalog Feed.
 * 
 * Supports:
 * - XML RSS 2.0 / Google Merchant & Facebook Product Catalog standard feed
 * - CSV format via ?format=csv
 * 
 * URL to paste into Facebook Commerce Manager:
 * https://nabd-nursing.vercel.app/api/facebook-catalog
 */

import { NextRequest, NextResponse } from 'next/server'
import { services } from '@/data/services'
import {
  FEATURED_GLUCOSE_METER,
  ADDITIONAL_MEDICAL_SUPPLIES,
} from '@/data/medicalSuppliesData'
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format')

  // 1. Catalog Products and Services List
  const items = [
    // 🩸 VivaChek Ino Glucose Meter (Hero Product)
    {
      id: 'vivachek-ino',
      title: 'جهاز قياس السكر في الدم فيفا تشيك إنو (VivaChek Ino) مع 10 شرائط هدية',
      description:
        'جهاز قياس السكر المنزلي فيفا تشيك إنو بدون ألم وبنتيجة فورية خلال 5 ثوانٍ، ذاكرة 90 يوماً، ضمان 5 سنوات، مع 10 شرائط هدية وقلم وخز وتوصيل لجميع مناطق دمياط.',
      link: `${BASE_URL}/services/medical-supplies#vivachek-ino`,
      image_link: `${BASE_URL}/vivachek.png`,
      brand: 'نبض للتمريض المنزلي',
      condition: 'new',
      availability: 'in stock',
      price: '650.00 EGP',
      sale_price: '450.00 EGP',
      google_product_category: 'Health & Beauty > Health Care > Medical Supplies',
      product_type: 'أجهزة قياس السكر والمستلزمات الطبية',
      custom_label_0: 'أجهزة طبية',
      custom_label_1: 'دمياط',
    },

    // 📦 Additional Medical Supplies
    ...ADDITIONAL_MEDICAL_SUPPLIES.map((sup) => ({
      id: sup.id,
      title: `${sup.name} — نبض للتمريض المنزلي`,
      description: `${sup.shortDesc} متوفر للتوصيل المنزلي لجميع مناطق دمياط.`,
      link: `${BASE_URL}/services/medical-supplies#${sup.id}`,
      image_link: `${BASE_URL}${sup.image.startsWith('/') ? sup.image : `/${sup.image}`}`,
      brand: 'نبض للتمريض المنزلي',
      condition: 'new',
      availability: 'in stock',
      price: sup.oldPrice ? `${parseInt(sup.oldPrice) || 500}.00 EGP` : `${parseInt(sup.price) || 350}.00 EGP`,
      sale_price: `${parseInt(sup.price) || 350}.00 EGP`,
      google_product_category: 'Health & Beauty > Health Care > Medical Supplies',
      product_type: sup.categoryName,
      custom_label_0: 'مستلزمات طبية',
      custom_label_1: 'دمياط',
    })),

    // 🩺 15 Home Nursing Services
    ...services.map((srv) => ({
      id: `service-${srv.id}`,
      title: `${srv.name} بالمنزل في دمياط — نبض`,
      description: `${srv.description} كادر تمريض مؤهل، أمان واحترافية ورعاية متكاملة في منزلك داخل دمياط.`,
      link: `${BASE_URL}/services/${srv.slug}`,
      image_link: `${BASE_URL}/og-image.jpg`,
      brand: 'نبض للتمريض المنزلي',
      condition: 'new',
      availability: 'in stock',
      price: '150.00 EGP',
      sale_price: '150.00 EGP',
      google_product_category: 'Health & Beauty > Health Care > Home Health Care Services',
      product_type: `خدمات تمريضية > ${srv.category}`,
      custom_label_0: 'خدمات تمريضية منزلية',
      custom_label_1: 'دمياط',
    })),
  ]

  // 2. Output CSV format if requested
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
      ...items.map((it) =>
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
        'Content-Disposition': 'inline; filename="facebook-catalog.csv"',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    })
  }

  // 3. Output XML / RSS 2.0 Google Merchant & Meta Product Feed (Default)
  const xmlItems = items
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
    <title>${sanitizeXml(siteConfig.brand.name)} — كتالوج الخدمات والمستلزمات الطبية</title>
    <link>${BASE_URL}</link>
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
