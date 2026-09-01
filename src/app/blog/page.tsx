import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import BlogSection from '@/components/sections/BlogSection'
import { getBlogProvider } from '@/lib/providers/BloggerProvider'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
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
        <section className="bg-gradient-primary py-8 sm:py-12">
          <div className="section-container">
            {/* Top Back Navigation */}
            <div className="flex items-center justify-between mb-6 max-w-3xl mx-auto">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-xl transition-all group"
              >
                <ArrowRightIcon className="w-4 h-4 text-gold-400 transition-transform group-hover:translate-x-1" />
                <span>العودة للرئيسية</span>
              </Link>
              <Link
                href="/services"
                className="text-xs font-bold text-gold-300 hover:text-gold-200 hover:underline"
              >
                تصفح الخدمات 🩺
              </Link>
            </div>

            <div className="text-center">
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
          </div>
        </section>

        <BlogSection posts={posts} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
