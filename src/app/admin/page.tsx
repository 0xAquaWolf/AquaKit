'use client';

import { Authenticated, Unauthenticated } from 'convex/react';
import { ArrowLeft } from 'lucide-react';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
import { authClient } from '@/lib/auth-client';

export default function AdminPage() {
  const { isPending } = authClient.useSession();

  // Show skeleton while checking authentication state
  if (isPending) {
    return <AdminDashboardSkeleton />;
  }

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
  const { isPending: sessionPending } = authClient.useSession();
  const isAdmin = useIsAdmin();
  const [isInitialRender, setIsInitialRender] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Small delay to prevent flash during initial render
    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  // Show skeleton while checking session, admin status, or during initial render
  if (isInitialRender || sessionPending || isAdmin === undefined) {
    return <AdminDashboardSkeleton />;
  }

  // Show access denied for non-admins
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
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
  return (
    <div className="py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="flex items-center gap-2 hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <AdminDashboard />
        </div>
      </div>
    </div>
  );
}
