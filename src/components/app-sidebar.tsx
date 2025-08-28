'use client';

import { useQuery } from 'convex/react';
import { Calendar, Home, Inbox, LogOut, Search, Settings } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { Avatar } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { api } from '@/convex/_generated/api';
import { authClient } from '@/lib/auth-client';

const items = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const currentUser = useQuery(api.auth.getCurrentUser);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="px-2 text-lg font-semibold">AquaKit</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar
                avatarUrl={currentUser?.avatarUrl}
                name={currentUser?.name}
                email={currentUser?.email || session?.user?.email || ''}
                avatarColor={currentUser?.avatarColor}
                size="sm"
              />
              <div className="flex flex-col min-w-0">
                <div className="text-sm font-medium truncate">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {currentUser?.email || session?.user?.email}
                </div>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
