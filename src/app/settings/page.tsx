'use client';

import AdminGuard from '@/components/admin/AdminGuard';
import AdminSettingsPage from '@/app/admin/settings/page';

export default function SettingsRoute() {
  return (
    <AdminGuard>
      <AdminSettingsPage />
    </AdminGuard>
  );
}
