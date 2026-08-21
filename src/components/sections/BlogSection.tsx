'use client'
/**
 * components/sections/BlogSection.tsx
 */
import type { BlogPost } from '@/lib/providers/BloggerProvider'
import { siteConfig } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

function BlogCard({ post }: { post: BlogPost }) {
  const date = post.publishedAt
    ? new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(post.publishedAt))
    : ''

  return (
    <article className="nabd-card overflow-hidden flex flex-col" aria-label={post.title}>
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center relative overflow-hidden">
        {post.thumbnail ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.thumbnail}
            alt={`صورة مقال: ${post.title}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-navy-400">
            <span className="text-4xl" aria-hidden="true">📝</span>
            <span className="text-xs font-medium">مقال صحي</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Labels */}
        {post.labels && post.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.labels.slice(0, 2).map((label) => (
              <span key={label} className="badge-navy text-xs">{label}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-navy-700 text-sm sm:text-base leading-snug line-clamp-2">
          {post.title}
        </h3>

        {/* Summary */}
        {post.summary && (
          <p className="text-medical-muted text-xs sm:text-sm leading-relaxed line-clamp-2 flex-1">
            {post.summary}
          </p>
        )}

        {/* Date + Read more */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-medical-border">
          {date && <span className="text-medical-muted text-xs">{date}</span>}
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs px-3 py-2"
            aria-label={`اقرأ المقال: ${post.title}`}
            onClick={() => analytics.blogClick()}
          >
            اقرأ المقال
            <ArrowLeftIcon className="w-3 h-3 ms-1 rtl:rotate-180" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}

function BlogCardSkeleton() {
  return (
    <div className="nabd-card overflow-hidden">
      <div className="skeleton aspect-video" />
      <div className="p-4 flex flex-col gap-2.5">
        <div className="skeleton w-20 h-4 rounded-full" />
        <div className="skeleton w-full h-5 rounded" />
        <div className="skeleton w-3/4 h-4 rounded" />
        <div className="skeleton w-full h-4 rounded" />
      </div>
    </div>
  )
}

interface BlogSectionProps {
  posts: BlogPost[]
  loading?: boolean
}

export default function BlogSection({ posts, loading = false }: BlogSectionProps) {
  return (
    <section
      className="bg-white"
      aria-labelledby="blog-heading"
    >
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h2 id="blog-heading" className="section-title">
            مقالات صحية من مدونة نبض
          </h2>
          <p className="section-subtitle">
            نصائح ومعلومات صحية مفيدة لك ولعائلتك
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)
            : posts.slice(0, 3).map((post) => <BlogCard key={post.id} post={post} />)
          }
        </div>

        {/* CTA to blog */}
        <div className="text-center mt-8">
          <a
            href={siteConfig.social.blogger}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
            onClick={() => analytics.blogClick()}
          >
            زيارة المدونة الصحية
            <ArrowLeftIcon className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
