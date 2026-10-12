import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nabd-nursing.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/dashboard',
          '/dashboard/',
          '/settings',
          '/settings/',
          '/patients/',
          '/appointments/',
        ],
      },
      // AI & LLM Search Engine Bots
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Applebot',
          'CCBot',
          'Bytespider',
          'cohere-ai',
          'OAI-SearchBot',
        ],
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/dashboard',
          '/dashboard/',
          '/settings',
          '/settings/',
          '/patients/',
          '/appointments/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
