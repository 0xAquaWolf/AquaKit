'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { authClient } from '@/lib/auth-client';

export function UserDebug() {
  const { data: session, isPending } = authClient.useSession();
  const currentUser = useQuery(api.auth.getCurrentUser);

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">🐛 User Debug Info</h3>
      <div className="space-y-2 text-xs">
        <div>
          <strong>Auth Session Pending:</strong> {isPending ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Auth Session:</strong> {session ? 'Loaded' : 'Not loaded'}
        </div>
        {session && (
          <div>
            <strong>Session User:</strong> {session.user?.email || 'No email'}
          </div>
        )}
        <div>
          <strong>Convex User Query:</strong>{' '}
          {currentUser
            ? 'Loaded'
            : currentUser === null
              ? 'Null'
              : 'Loading...'}
        </div>
        {currentUser && (
          <div>
            <strong>User Email:</strong> {currentUser.email || 'No email'}
          </div>
        )}
        {currentUser === null && session && (
          <div className="text-red-600">
            <strong>⚠️ Issue:</strong> Session exists but Convex user is null
          </div>
        )}
      </div>
    </div>
  );
}
