import { Authenticated, Unauthenticated } from 'convex/react';

import Link from 'next/link';

import { DebugPageSkeleton } from '@/components/admin/debug-page-skeleton';
import { AccountLinkingTest } from '@/components/debug/account-linking-test';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useIsAdmin } from '@/hooks/use-admin';

export default function AccountLinkingDebugPage() {
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
        <DebugPageContent />
      </Authenticated>
    </>
  );
}

function DebugPageContent() {
  const isAdmin = useIsAdmin();

  // Show skeleton while checking admin status
  if (isAdmin === undefined) {
    return <DebugPageSkeleton />;
  }

  // Show access denied for non-admins
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Debug Access Required</CardTitle>
            <CardDescription>
              You need admin privileges to access debug tools.
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

  // Show debug content for admins
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <AccountLinkingTest />
      </div>
    </div>
  );
}
