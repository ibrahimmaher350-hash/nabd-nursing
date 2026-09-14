'use client';

import AdminGuard from '@/components/admin/AdminGuard';
import PatientProfilePage from '@/app/admin/patients/[id]/page';

export default function PatientRoute() {
  return (
    <AdminGuard>
      <PatientProfilePage />
    </AdminGuard>
  );
}
