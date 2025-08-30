'use client';

import { BarChart3, Settings, Shield, Users } from 'lucide-react';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// import { AdminStats } from './admin-stats';
// import { UserList } from './user-list';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* <AdminStats /> */}

          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Authentication Methods</h4>
                  <p className="text-sm text-muted-foreground">
                    Users can sign in with email, Google, GitHub, or Discord
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">User Roles</h4>
                  <p className="text-sm text-muted-foreground">
                    Admin and User roles with different permission levels
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">User Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Create, ban, unban, and delete users as needed
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Admin Controls</h4>
                  <p className="text-sm text-muted-foreground">
                    Full administrative control over the application
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* <UserList /> */}
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Admin Role</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Create, edit, and delete users</li>
                      <li>• Ban and unban users</li>
                      <li>• Change user roles</li>
                      <li>• Access all admin functions</li>
                      <li>• View system statistics</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">User Role</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Access to user dashboard</li>
                      <li>• Update own profile</li>
                      <li>• Use application features</li>
                      <li>• No administrative access</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Admin Assignment</h4>
                  <p className="text-sm text-muted-foreground">
                    Admins can be assigned through:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                    <li>• ADMIN_EMAILS environment variable</li>
                    <li>• Direct role assignment in the user management tab</li>
                    <li>• Database role field set to &quot;admin&quot;</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Environment Configuration</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure your application through environment variables:
                  </p>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm">
                    <div>ADMIN_EMAILS=admin@example.com,admin2@example.com</div>
                    <div>NEXT_PUBLIC_SITE_URL=https://yourapp.com</div>
                    <div>CONVEX_DEPLOYMENT=your-deployment</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Authentication Providers</h4>
                  <p className="text-sm text-muted-foreground">
                    Supported OAuth providers:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Google OAuth</li>
                    <li>• GitHub OAuth</li>
                    <li>• Discord OAuth</li>
                    <li>• Email/Password authentication</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Database</h4>
                  <p className="text-sm text-muted-foreground">
                    Powered by Convex for real-time functionality and type
                    safety.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
