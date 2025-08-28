'use client';

import { Authenticated, Unauthenticated } from 'convex/react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useIsAdmin } from '@/hooks/use-admin';

interface AdminGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

/**
 * AdminGuard component that protects admin-only content
 * Handles authentication and admin role verification
 */
export function AdminGuard({
  children,
  title = 'Admin Access Required',
  description = 'You need admin privileges to access this page.',
}: AdminGuardProps) {
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
        <AdminAccessGuard title={title} description={description}>
          {children}
        </AdminAccessGuard>
      </Authenticated>
    </>
  );
}

function AdminAccessGuard({
  children,
  title,
  description,
}: AdminGuardProps & { title: string; description: string }) {
  const isAdmin = useIsAdmin();

  // Show loading state while checking admin status
  if (isAdmin === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied for non-admins
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
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

  // Show protected content for admins
  return <>{children}</>;
}
