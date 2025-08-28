'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

/**
 * Hook to check if the current user is an admin
 * Returns true if user has admin role or email is in ADMIN_EMAILS env var
 */
export function useIsAdmin() {
  const isAdmin = useQuery(api.auth.isCurrentUserAdmin);
  return isAdmin ?? false;
}

/**
 * Hook to get all admin users (admin only)
 */
export function useAdminUsers() {
  const adminUsers = useQuery(api.auth.getAdminUsers);
  return adminUsers ?? [];
}
