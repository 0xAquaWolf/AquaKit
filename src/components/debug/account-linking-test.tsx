'use client';

import { useMutation, useQuery } from 'convex/react';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/convex/_generated/api';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export function AccountLinkingTest() {
  const [testEmail, setTestEmail] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Debug queries
  const userAccounts = useQuery(api.auth.debugUserAccounts);
  const emailSearch = useQuery(
    api.auth.debugFindUsersByEmail,
    testEmail ? { email: testEmail } : 'skip'
  );

  // Mutation for clearing users
  const clearAllUsers = useMutation(api.auth.devClearAllUsers);

  const handleLinkProvider = async (
    provider: 'google' | 'github' | 'discord'
  ) => {
    setIsLinking(true);
    try {
      await authClient.linkSocial({ provider });
    } catch (error) {
      console.error('Error linking provider:', error);
    } finally {
      setIsLinking(false);
    }
  };

  const handleClearAllUsers = async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This will DELETE ALL USERS from your database!\n\n' +
        'This action is IRREVERSIBLE and should only be used in development.\n\n' +
        'Are you absolutely sure you want to continue?'
    );

    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Type "DELETE_ALL_USERS_CONFIRM" to proceed:'
    );

    if (doubleConfirm !== 'DELETE_ALL_USERS_CONFIRM') {
      alert('Operation cancelled - confirmation phrase not matched.');
      return;
    }

    setIsClearing(true);
    try {
      const result = await clearAllUsers({
        confirmDeletion: 'DELETE_ALL_USERS_CONFIRM',
        environment: 'development',
      });

      alert(`✅ ${result.message}`);
    } catch (error) {
      console.error('Error clearing users:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Failed to clear users: ${errorMessage}`);
    } finally {
      setIsClearing(false);
    }
  };

  // Social auth icons (matching the login form)
  const GoogleIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  const GitHubIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );

  const DiscordIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
    </svg>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Account Linking Debug Panel
          </CardTitle>
          <CardDescription>
            Debug and test account linking functionality across different OAuth
            providers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current User Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Current User</h3>
            {userAccounts?.currentUser ? (
              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">User ID:</span>{' '}
                      {userAccounts.currentUser.userId}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span>{' '}
                      {userAccounts.currentUser.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-muted">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    No authenticated user
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Link Additional Providers */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Link Additional Providers
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleLinkProvider('google')}
                disabled={isLinking}
                variant="outline"
                className={cn(
                  'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200',
                  'dark:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:border-blue-800'
                )}
              >
                <GoogleIcon />
                Link Google
              </Button>
              <Button
                onClick={() => handleLinkProvider('github')}
                disabled={isLinking}
                variant="outline"
                className={cn(
                  'text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200',
                  'dark:text-gray-300 dark:bg-gray-800/50 dark:hover:bg-gray-800 dark:border-gray-700'
                )}
              >
                <GitHubIcon />
                Link GitHub
              </Button>
              <Button
                onClick={() => handleLinkProvider('discord')}
                disabled={isLinking}
                variant="outline"
                className={cn(
                  'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
                  'dark:text-indigo-300 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:border-indigo-800'
                )}
              >
                <DiscordIcon />
                Link Discord
              </Button>
            </div>
            {isLinking && (
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                <span className="animate-spin">⏳</span> Linking provider...
              </p>
            )}
          </div>

          {/* Email Search */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Search Users by Email
            </h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="email-search" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="email-search"
                  type="email"
                  placeholder="Enter email to search..."
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <Button
                onClick={() => setTestEmail(testEmail)}
                variant="secondary"
              >
                🔍 Search
              </Button>
            </div>

            {emailSearch && (
              <Card className="mt-3">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Results for:</span>
                      <Badge variant="outline">{emailSearch.email}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">User Count:</span>
                      <Badge
                        variant={
                          emailSearch.userCount === 1
                            ? 'default'
                            : emailSearch.userCount > 1
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {emailSearch.userCount}
                      </Badge>
                    </div>
                    {emailSearch.userCount === 1 ? (
                      <p className="text-green-600 flex items-center gap-1 text-sm">
                        ✅ No duplicates - account linking working!
                      </p>
                    ) : emailSearch.userCount > 1 ? (
                      <p className="text-red-600 flex items-center gap-1 text-sm">
                        ❌ Multiple users found - potential duplicate accounts
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No users found with this email
                      </p>
                    )}

                    {emailSearch.users.length > 0 && (
                      <div>
                        <p className="font-medium text-sm mb-2">Users:</p>
                        <ul className="space-y-1">
                          {emailSearch.users.map((user) => (
                            <li
                              key={user.id}
                              className="text-sm flex items-center gap-2"
                            >
                              <span>
                                {user.name || 'No name'} ({user.email})
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {user.lastAuthMethod || 'unknown'}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* All Users Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-3">All Users Summary</h3>
            {userAccounts ? (
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Total Users:</span>
                      <Badge variant="secondary">
                        {userAccounts.totalUsers}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-2">Recent Users:</p>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {userAccounts.users.slice(-10).map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span>
                              {user.name || 'No name'} ({user.email})
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {user.lastAuthMethod || 'unknown'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-muted-foreground">Loading user data...</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Database Cleanup */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Development Tools</h3>
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <p className="text-sm text-red-700">
                    ⚠️ <span className="font-semibold">Danger Zone:</span> The
                    button below will permanently delete all users from your
                    database.
                  </p>
                  <Button
                    onClick={handleClearAllUsers}
                    disabled={isClearing}
                    variant="destructive"
                  >
                    {isClearing ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Clearing Database...
                      </>
                    ) : (
                      '🗑️ Clear All Users (DEV ONLY)'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Testing Instructions */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-lg">Testing Instructions</CardTitle>
          <CardDescription>
            Follow these steps to test account linking functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Sign up with one provider (e.g., Google) using a test email</li>
            <li>Note the user count and search for your email above</li>
            <li>
              Log out and sign in with a different provider using the same email
            </li>
            <li>
              Check if the user count remains 1 (indicating successful linking)
            </li>
            <li>
              Use the "Link Additional Providers" buttons to manually link more
              providers
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
