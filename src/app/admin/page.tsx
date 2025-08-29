'use client';

import { ArrowLeft } from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AdminGuard } from '@/components/admin/admin-guard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminPage() {
  return (
    <AdminGuard
      fallback={
        <div className="min-h-screen flex items-center justify-center py-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You need to be logged in with admin privileges to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      }
    >
      <AdminPageContent />
    </AdminGuard>
  );
}

function AdminPageContent() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  // Show admin panel for admins - clean slate
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

          {/* Admin Panel Content - Clean Slate */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <h1 className="text-3xl font-bold tracking-tight">
                Admin Panel
              </h1>
              <p className="text-muted-foreground">
                Welcome to the admin panel. Start building your admin functionality here.
              </p>
            </div>
            <div className="p-6 pt-0">
              <p className="text-sm text-muted-foreground">
                This is a clean slate admin panel with authentication guard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
