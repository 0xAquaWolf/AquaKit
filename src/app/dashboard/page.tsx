'use client';

import { useMutation, useQuery } from 'convex/react';

import { Suspense, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { api } from '@/convex/_generated/api';
import { authClient } from '@/lib/auth-client';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  const updateAuthMethod = useMutation(api.auth.updateLastAuthMethod);
  const currentUser = useQuery(api.auth.getCurrentUser);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const authMethod = searchParams.get('authMethod');
    if (
      authMethod &&
      session &&
      currentUser && // Wait for currentUser to be loaded
      (authMethod === 'email' ||
        authMethod === 'google' ||
        authMethod === 'github' ||
        authMethod === 'discord')
    ) {
      // Small delay to ensure Convex auth is fully synchronized
      const timer = setTimeout(() => {
        updateAuthMethod({ authMethod }).catch((err) =>
          console.warn('Failed to update auth method:', err)
        );
      }, 100);

      // Clean up URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('authMethod');
      window.history.replaceState({}, '', url.toString());

      return () => clearTimeout(timer);
    }
  }, [searchParams, session, currentUser, updateAuthMethod]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
