'use client';

import { useQuery } from 'convex/react';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { authClient } from '@/lib/auth-client';

export default function AuthCallbackPage() {
  const { data: session } = authClient.useSession();
  const banStatus = useQuery(
    api.auth.checkCurrentUserBanStatus,
    session ? {} : 'skip'
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Wait for session and ban status to load
    if (!session || banStatus === undefined) {
      return;
    }

    // If user is banned, sign them out and redirect to login with error
    if (banStatus?.isBanned) {
      const handleBannedUser = async () => {
        await authClient.signOut();

        // Create ban message
        const banMessage =
          banStatus.banReason || 'Your account has been banned.';
        const expiryMessage = banStatus.banExpires
          ? ` Ban expires on ${new Date(banStatus.banExpires).toLocaleDateString()}.`
          : ' This ban is permanent.';

        const fullMessage = `${banMessage}${expiryMessage} Please contact support if you believe this is an error.`;

        // Redirect to login with error message
        router.push(`/login?error=${encodeURIComponent(fullMessage)}`);
      };

      handleBannedUser();
      return;
    }

    // User is not banned, redirect to dashboard with auth method
    const authMethod = searchParams.get('authMethod') || '';
    router.push(`/dashboard${authMethod ? `?authMethod=${authMethod}` : ''}`);
  }, [session, banStatus, router, searchParams]);

  // Show loading state while checking
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
