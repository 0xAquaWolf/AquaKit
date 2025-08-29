'use client';

import { useQuery } from 'convex/react';

import { ReactNode, useEffect, useState } from 'react';

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
  const [hasStabilized, setHasStabilized] = useState(false);

  // Give the admin check a moment to stabilize after session loads
  useEffect(() => {
    if (!sessionPending && session && isAdmin !== undefined) {
      // Wait longer for admin check to stabilize after session loads
      const timer = setTimeout(() => {
        setHasStabilized(true);
      }, 1000); // 1 second buffer to ensure query has time to update
      
      return () => clearTimeout(timer);
    } else if (!session && !sessionPending) {
      // If there's no session, we can stabilize immediately
      setHasStabilized(true);
    } else {
      setHasStabilized(false);
    }
  }, [sessionPending, session, isAdmin]);

  // Show loading while session is pending
  if (sessionPending) {
    return <AuthLoading />;
  }

  // Show loading while admin status is undefined
  if (isAdmin === undefined) {
    return <AuthLoading />;
  }

  // Show loading while we're waiting for the admin check to stabilize
  // This prevents the flash of "access denied" when session loads but admin check hasn't updated yet
  if (session && !hasStabilized) {
    return <AuthLoading />;
  }

  // At this point we have definitive and stabilized results

  // No session - show access denied
  if (!session) {
    return fallback || <div>Access denied. Please sign in.</div>;
  }

  // Session exists and admin check is stabilized
  if (isAdmin === true) {
    return <>{children}</>;
  } else {
    // isAdmin === false - user is definitely not an admin
    return fallback || <div>Access denied. Admin privileges required.</div>;
  }
}
