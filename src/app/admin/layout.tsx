import type { Metadata } from 'next'
import AdminGuard from '@/components/admin/AdminGuard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'لوحة التحكم الخاصة | نبض للتمريض المنزلي',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminGuard>{children}</AdminGuard>
}
