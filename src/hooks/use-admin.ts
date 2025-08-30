'use client';

import { authClient } from '@/lib/auth-client';

/**
 * Hook to check if the current user is an admin
 * Returns true if user has admin role or email is in ADMIN_EMAILS env var
 * Returns undefined while loading, false for non-admin, true for admin
 */
export function useIsAdmin() {
  const { data: session } = authClient.useSession();
  console.log('session (useIsAdmin)', session);

  return (session?.user as { role?: string })?.role === 'admin';
}
