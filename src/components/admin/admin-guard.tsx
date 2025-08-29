'use client';

import { useQuery } from 'convex/react';

import { ReactNode } from 'react';

import { api } from '@/convex/_generated/api';
import { authClient } from '@/lib/auth-client';

import { AuthLoading } from './auth-loading';

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const isAdmin = useQuery(api.auth.isCurrentUserAdmin);

  // Log current state for debugging
  console.log('AdminGuard state:', {
    sessionPending,
    hasSession: !!session,
    isAdmin,
    isAdminUndefined: isAdmin === undefined
  });

  // Show loading if session is pending OR if we have a session but admin check is still loading
  if (sessionPending) {
    console.log('Showing loading: session pending');
    return <AuthLoading />;
  }

  if (session && isAdmin === undefined) {
    console.log('Showing loading: session exists but admin check undefined');
    return <AuthLoading />;
  }

  if (!session && isAdmin === undefined) {
    console.log('Showing loading: no session and admin check undefined');
    return <AuthLoading />;
  }

  // No session - show sign in prompt
  if (!session) {
    console.log('Showing access denied: no session');
    return fallback || <div>Access denied. Please sign in.</div>;
  }

  // Session exists and user is explicitly not admin
  if (isAdmin === false) {
    console.log('Showing access denied: not admin');
    return fallback || <div>Access denied. Admin privileges required.</div>;
  }

  // Session exists and user is admin
  if (isAdmin === true) {
    console.log('Showing admin content');
    return <>{children}</>;
  }

  // Should not reach here - fallback to loading
  console.log('Fallback to loading');
  return <AuthLoading />;
}
