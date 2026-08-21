/**
 * app/blog/page.tsx — المدونة الصحية
 */
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import BlogSection from '@/components/sections/BlogSection'
import { getBlogProvider } from '@/lib/providers/BloggerProvider'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: 'المدونة الصحية | نبض للتمريض المنزلي',
  description: 'مقالات ونصائح صحية من مدونة نبض للتمريض المنزلي في دمياط.',
  alternates: { canonical: '/blog' },
}

export const revalidate = 3600

export default async function BlogPage() {
  const provider = getBlogProvider()
  const posts = await provider.getPosts(9)

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-gradient-primary py-10 sm:py-14">
          <div className="section-container text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              المدونة الصحية
            </h1>
            <p className="text-white/70 text-base max-w-md mx-auto">
              نصائح ومعلومات صحية مفيدة من مدونة نبض للتمريض المنزلي
            </p>
            <a
              href={siteConfig.social.blogger}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-gold-300 text-sm font-medium hover:text-gold-200 transition-colors"
            >
              زيارة المدونة الأصلية →
            </a>
          </div>
        </section>

        <BlogSection posts={posts} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
