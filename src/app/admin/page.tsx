'use client';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AdminGuard } from '@/components/admin/admin-guard';

export default function AdminPage() {
  return (
    <AdminGuard
      title="Admin Access Required"
      description="You need admin privileges to access the admin panel."
    >
      <AdminDashboard />
    </AdminGuard>
  );
}
