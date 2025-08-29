'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

/**
 * Hook to check if the current user is an admin
 * Returns true if user has admin role or email is in ADMIN_EMAILS env var
 * Returns undefined while loading, false for non-admin, true for admin
 */
export function useIsAdmin() {
  const getCurrentUser = useQuery(api.auth.getCurrentUser);
  const isAdmin = useQuery(api.auth.isCurrentUserAdmin, getCurrentUser ? {} : "skip");
  return isAdmin;
}
