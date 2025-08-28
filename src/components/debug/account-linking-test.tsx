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
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
              >
                🔗 Link Google
              </Button>
              <Button
                onClick={() => handleLinkProvider('github')}
                disabled={isLinking}
                variant="default"
                className="bg-gray-800 hover:bg-gray-900"
              >
                🔗 Link GitHub
              </Button>
              <Button
                onClick={() => handleLinkProvider('discord')}
                disabled={isLinking}
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                🔗 Link Discord
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
