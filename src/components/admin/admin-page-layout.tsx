'use client';

import { AdminGuard } from './admin-guard';

interface AdminPageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

/**
 * AdminPageLayout component that provides a consistent layout for admin pages
 * Automatically includes AdminGuard protection
 */
export function AdminPageLayout({
  children,
  title = 'Admin Access Required',
  description = 'You need admin privileges to access this page.',
}: AdminPageLayoutProps) {
  return (
    <AdminGuard title={title} description={description}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">{children}</div>
      </div>
    </AdminGuard>
  );
}
