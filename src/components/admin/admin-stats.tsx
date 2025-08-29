'use client';

import { useQuery } from 'convex/react';
import { Shield, UserCheck, UserX, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { api } from '../../../convex/_generated/api';

export function AdminStats() {
  const usersData = useQuery(api.auth.adminListUsers, {
    limit: 1000, // Get all users for stats
  });

  // Show loading skeleton while data is being fetched
  if (usersData === undefined) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const users = usersData?.users || [];
  const totalUsers = users.length;
  const adminUsers = users.filter((user) => user.role === 'admin').length;
  const bannedUsers = users.filter((user) => user.banned).length;
  const activeUsers = totalUsers - bannedUsers;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      description: 'All registered users',
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: UserCheck,
      description: 'Non-banned users',
    },
    {
      title: 'Banned Users',
      value: bannedUsers,
      icon: UserX,
      description: 'Currently banned',
    },
    {
      title: 'Admin Users',
      value: adminUsers,
      icon: Shield,
      description: 'Users with admin privileges',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
