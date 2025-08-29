'use client';

import { useSession } from 'better-auth/react';
import { ReactNode } from 'react';

import { authClient } from '@/lib/auth-client';

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return fallback || <div>Loading...</div>;
  }

  if (!session) {
    return fallback || <div>Access denied. Please sign in.</div>;
  }

  // Check if user has admin role using Better Auth admin plugin
  const hasAdminRole = session.user.role === 'admin';

  if (!hasAdminRole) {
    return fallback || <div>Access denied. Admin privileges required.</div>;
  }

  return <>{children}</>;
}