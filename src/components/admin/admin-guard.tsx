'use client';

import { useQuery } from 'convex/react';

import { ReactNode } from 'react';

import { api } from '@/convex/_generated/api';
import { authClient } from '@/lib/auth-client';

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { data: session, isPending } = authClient.useSession();
  const isAdmin = useQuery(api.auth.isCurrentUserAdmin);

  if (isPending || isAdmin === undefined) {
    return fallback || <div>Loading...</div>;
  }

  if (!session) {
    return fallback || <div>Access denied. Please sign in.</div>;
  }

  if (!isAdmin) {
    return fallback || <div>Access denied. Admin privileges required.</div>;
  }

  return <>{children}</>;
}
