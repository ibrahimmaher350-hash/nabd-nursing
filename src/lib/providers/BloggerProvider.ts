/**
 * lib/providers/BloggerProvider.ts — نبض للتمريض المنزلي
 * Blogger API adapter — abstraction layer for blog content.
 * Swappable with Firestore/WordPress/Headless CMS in the future.
 */

export interface BlogPost {
  id: string
  title: string
  url: string
  summary: string
  thumbnail?: string
  publishedAt: string
  labels?: string[]
  author?: string
}

export interface BlogProvider {
  getPosts(count?: number): Promise<BlogPost[]>
  getPostById(id: string): Promise<BlogPost | null>
}

// ── Blogger Provider ──────────────────────────────────────────
export class BloggerProvider implements BlogProvider {
  private readonly blogUrl: string
  private readonly apiKey?: string
  private readonly blogId?: string

  constructor(config: { blogUrl: string; apiKey?: string; blogId?: string }) {
    this.blogUrl  = config.blogUrl
    this.apiKey   = config.apiKey
    this.blogId   = config.blogId
  }

  async getPosts(count = 6): Promise<BlogPost[]> {
    // If no API key/blogId configured, return empty (no crash)
    if (!this.apiKey || !this.blogId) {
      return this.getFallbackPosts()
    }

    try {
      const url = `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts?key=${this.apiKey}&maxResults=${count}&fields=items(id,title,url,summary,published,labels,author,images)`
      const res = await fetch(url, { next: { revalidate: 3600 } }) // 1 hour cache

      if (!res.ok) throw new Error(`Blogger API error: ${res.status}`)
      const data = await res.json()

      return (data.items ?? []).map(this.mapBloggerPost)
    } catch (err) {
      console.error('[BloggerProvider] Error fetching posts:', err)
      return this.getFallbackPosts()
    }
  }

  async getPostById(id: string): Promise<BlogPost | null> {
    if (!this.apiKey || !this.blogId) return null

    try {
      const url = `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts/${id}?key=${this.apiKey}`
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (!res.ok) return null
      const data = await res.json()
      return this.mapBloggerPost(data)
    } catch {
      return null
    }
  }

  private mapBloggerPost(post: Record<string, unknown>): BlogPost {
    return {
      id:          String(post.id ?? ''),
      title:       String(post.title ?? ''),
      url:         String(post.url ?? ''),
      summary:     String(post.summary ?? '').slice(0, 200),
      thumbnail:   (post.images as Array<{url: string}>)?.[0]?.url,
      publishedAt: String(post.published ?? ''),
      labels:      post.labels as string[] | undefined,
      author:      (post.author as {displayName?: string})?.displayName,
    }
  }

  // Fallback posts when API is not configured
  private getFallbackPosts(): BlogPost[] {
    return [
      {
        id: 'placeholder-1',
        title: 'أهمية الرعاية التمريضية المنزلية لكبار السن',
        url: 'https://nabd-damietta.blogspot.com/?m=1',
        summary: 'تعرف على أهمية الرعاية التمريضية المنزلية في دعم صحة كبار السن ومساعدة الأسرة.',
        publishedAt: new Date().toISOString(),
        labels: ['رعاية كبار السن', 'تمريض منزلي'],
      },
      {
        id: 'placeholder-2',
        title: 'كيف تعتني بجرح ما بعد العملية في المنزل؟',
        url: 'https://nabd-damietta.blogspot.com/?m=1',
        summary: 'إرشادات للعناية بالجروح الجراحية في المنزل لضمان التعافي السريع.',
        publishedAt: new Date().toISOString(),
        labels: ['العناية بالجروح', 'بعد العملية'],
      },
    ]
  }
}

// ── Blog Service Singleton ────────────────────────────────────
import { siteConfig } from '@/data/siteConfig'

let _blogProvider: BlogProvider | null = null

export function getBlogProvider(): BlogProvider {
  if (!_blogProvider) {
    _blogProvider = new BloggerProvider({
      blogUrl: siteConfig.blog.bloggerUrl,
      apiKey:  process.env.BLOGGER_API_KEY,
      blogId:  siteConfig.blog.blogId ?? undefined,
    })
  }
  return _blogProvider
}
