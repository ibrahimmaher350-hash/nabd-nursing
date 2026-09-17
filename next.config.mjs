/** @type {import('next').NextConfig} */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nabd-nursing.vercel.app'
const isProduction = process.env.VERCEL_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.blogger.com',
      },
      {
        protocol: 'https',
        hostname: '**.blogspot.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // Security headers for all routes
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Block indexing of Vercel preview URLs — fixes Google Search Console
          // "نسخة طبق الأصل، لم يختر المستخدم النسخة الأساسية" (duplicate without canonical)
          ...(isProduction
            ? []
            : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
        ],
      },
    ]
  },
}

export default nextConfig
