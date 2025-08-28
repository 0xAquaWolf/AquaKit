'use client';

import { useMutation, useQuery } from 'convex/react';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { AppSidebar } from '@/components/app-sidebar';
import { AuthMethodBadge } from '@/components/auth-method-badge';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { api } from '@/convex/_generated/api';
import { authClient } from '@/lib/auth-client';

export default function Dashboard() {
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
      (authMethod === 'google' ||
        authMethod === 'github' ||
        authMethod === 'discord')
    ) {
      updateAuthMethod({ authMethod }).catch((err) =>
        console.warn('Failed to update auth method:', err)
      );
      // Clean up URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('authMethod');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, session, updateAuthMethod]);

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
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <div className="px-4">
            {currentUser?.lastAuthMethod && (
              <AuthMethodBadge authMethod={currentUser.lastAuthMethod} />
            )}
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
