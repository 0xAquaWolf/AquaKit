'use client';

import { Authenticated, Unauthenticated } from 'convex/react';

import Link from 'next/link';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AdminDashboardSkeleton } from '@/components/admin/admin-dashboard-skeleton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useIsAdmin } from '@/hooks/use-admin';

export default function AdminPage() {
  return (
    <>
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                You need to be logged in to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Unauthenticated>
      <Authenticated>
        <AdminPageContent />
      </Authenticated>
    </>
  );
}

function AdminPageContent() {
  const isAdmin = useIsAdmin();

  // Show skeleton while checking admin status
  if (isAdmin === undefined) {
    return <AdminDashboardSkeleton />;
  }

  // Show access denied for non-admins
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              You need admin privileges to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show admin dashboard for admins
  return <AdminDashboard />;
}
