/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
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
  // Permanent 301 Redirects for SEO & Clean Navigation
  async redirects() {
    return [
      {
        source: '/first-aid',
        destination: '/medical-guide',
        permanent: true,
      },
      {
        source: '/prescriptions',
        destination: '/medical-guide',
        permanent: true,
      },
      {
        source: '/offers',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/blood-bank',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blood-bank/:path*',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      // 1. General SEO & Security headers for all public routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
      // 2. Override for Private & Internal admin/api routes: NEVER index
      {
        source: '/(admin|api|dashboard|settings|patients|appointments)/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
    ]
  },
}

export default nextConfig
