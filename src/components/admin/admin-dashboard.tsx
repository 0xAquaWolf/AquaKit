'use client';

import { useMutation, useQuery } from 'convex/react';

import { useState } from 'react';

import Link from 'next/link';

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
import { Separator } from '@/components/ui/separator';
import { api } from '@/convex/_generated/api';
import { useAdminUsers } from '@/hooks/use-admin';

export function AdminDashboard() {
  const [testEmail, setTestEmail] = useState('');
  const [isInitializingAdmins, setIsInitializingAdmins] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Queries
  const userAccounts = useQuery(api.auth.debugUserAccounts);
  const emailSearch = useQuery(
    api.auth.debugFindUsersByEmail,
    testEmail ? { email: testEmail } : 'skip'
  );
  const adminUsers = useAdminUsers();

  // Mutations
  const initializeAdmins = useMutation(api.auth.initializeAdmins);
  const clearAllUsers = useMutation(api.auth.devClearAllUsers);
  const setUserRole = useMutation(api.auth.setUserRole);

  const handleInitializeAdmins = async () => {
    setIsInitializingAdmins(true);
    try {
      await initializeAdmins({});
      alert('✅ Admin initialization completed! Check console for details.');
    } catch (error) {
      console.error('Error initializing admins:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Failed to initialize admins: ${errorMessage}`);
    } finally {
      setIsInitializingAdmins(false);
    }
  };

  const handleSetUserRole = async (userId: string, role: 'admin' | 'user') => {
    try {
      await setUserRole({ userId: userId as any, role });
      alert(`✅ User role updated to ${role}`);
    } catch (error) {
      console.error('Error setting user role:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Failed to set user role: ${errorMessage}`);
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                🔧 Admin Dashboard
              </CardTitle>
              <CardDescription>
                Manage users, debug account linking, and configure admin
                settings
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Admin Management */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Management</CardTitle>
              <CardDescription>
                Manage admin users and initialize admin roles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Current Admin Users
                </h3>
                {adminUsers.length > 0 ? (
                  <div className="space-y-2">
                    {adminUsers.map((admin) => (
                      <div
                        key={admin._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {admin.name || 'No name'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {admin.email}
                          </p>
                        </div>
                        <Badge variant="default">Admin</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No admin users found</p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Initialize Admin Roles
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Set admin roles for users based on the ADMIN_EMAILS
                  environment variable
                </p>
                <Button
                  onClick={handleInitializeAdmins}
                  disabled={isInitializingAdmins}
                  variant="outline"
                >
                  {isInitializingAdmins ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Initializing...
                    </>
                  ) : (
                    '🔄 Initialize Admin Roles'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Debug Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Debug Tools</CardTitle>
              <CardDescription>
                Tools for debugging and testing account functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/debug/account-linking">
                      🔗 Account Linking Debug
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard">📊 User Dashboard</Link>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Email Search */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Search Users by Email
                </h3>
                <div className="flex gap-2 mb-3">
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
                    size="sm"
                  >
                    🔍 Search
                  </Button>
                </div>

                {emailSearch && (
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Results for:
                          </span>
                          <Badge variant="outline">{emailSearch.email}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            User Count:
                          </span>
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
                            ❌ Multiple users found - potential duplicate
                            accounts
                          </p>
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            No users found with this email
                          </p>
                        )}

                        {emailSearch.users.length > 0 && (
                          <div>
                            <p className="font-medium text-sm mb-2">Users:</p>
                            <div className="space-y-2">
                              {emailSearch.users.map((user) => (
                                <div
                                  key={user.id}
                                  className="flex items-center justify-between p-2 border rounded"
                                >
                                  <div className="text-sm">
                                    <span>
                                      {user.name || 'No name'} ({user.email})
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {user.lastAuthMethod || 'unknown'}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleSetUserRole(user.id, 'admin')
                                      }
                                    >
                                      Make Admin
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleSetUserRole(user.id, 'user')
                                      }
                                    >
                                      Make User
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Separator />

              {/* All Users Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  All Users Summary
                </h3>
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
                          <p className="font-medium text-sm mb-2">
                            Recent Users:
                          </p>
                          <div className="max-h-40 overflow-y-auto space-y-1">
                            {userAccounts.users.slice(-10).map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center gap-2 text-sm p-2 border rounded"
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
                      <p className="text-muted-foreground">
                        Loading user data...
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-red-700">🚨 Danger Zone</CardTitle>
              <CardDescription className="text-red-600">
                These actions can cause permanent data loss. Use with extreme
                caution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-red-700">
                  ⚠️ <span className="font-semibold">Warning:</span> The button
                  below will permanently delete all users from your database.
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

          {/* Setup Instructions */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg">
                📚 Admin Setup Instructions
              </CardTitle>
              <CardDescription>
                How to configure admin access for your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">1. Set Admin Emails</h4>
                  <p className="text-muted-foreground mb-2">
                    Add the ADMIN_EMAILS environment variable to your Convex
                    deployment:
                  </p>
                  <code className="block p-2 bg-muted rounded text-xs">
                    ADMIN_EMAILS=your-email@company.com,teammate@company.com
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    2. Initialize Admin Roles
                  </h4>
                  <p className="text-muted-foreground">
                    Click the "Initialize Admin Roles" button above to set admin
                    roles for users with emails in the ADMIN_EMAILS list.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Access Admin Panel</h4>
                  <p className="text-muted-foreground">
                    Admin users will see the "🔧 Admin" button in the navigation
                    bar when logged in.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
