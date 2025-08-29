"use client";

import { PropsWithChildren, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';

import { AppSidebar } from '@/components/app-sidebar';
import { GithubStar, GithubStarSkeleton } from '@/components/github-star';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { api } from '@/convex/_generated/api';
import { authClient } from '@/lib/auth-client';

function DashboardLayoutInner({ children }: PropsWithChildren) {
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
      currentUser &&
      (authMethod === 'email' ||
        authMethod === 'google' ||
        authMethod === 'github' ||
        authMethod === 'discord')
    ) {
      const timer = setTimeout(() => {
        updateAuthMethod({ authMethod }).catch((err) =>
          console.warn('Failed to update auth method:', err)
        );
      }, 100);

      const url = new URL(window.location.href);
      url.searchParams.delete('authMethod');
      window.history.replaceState({}, '', url.toString());

      return () => clearTimeout(timer);
    }
  }, [searchParams, session, currentUser, updateAuthMethod]);

  if (isPending) {
    return <DashboardSkeleton />;
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
          <div className="px-4 flex items-center gap-2">
            <ThemeToggle />
            <Suspense fallback={<GithubStarSkeleton />}>
              <GithubStar />
            </Suspense>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={<DashboardSkeleton />}>{children && <DashboardLayoutInner>{children}</DashboardLayoutInner>}</Suspense>;
}
