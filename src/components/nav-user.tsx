'use client';

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconMoon,
  IconNotification,
  IconSettings,
  IconSun,
  IconUserCircle,
} from '@tabler/icons-react';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import {
  ShadcnAvatar as Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useIsAdmin } from '@/hooks/use-admin';
import { authClient } from '@/lib/auth-client';

interface NavUserProps {
  user: {
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
    avatarColor?: string;
  };
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }

  if (email) {
    const emailPart = email.split('@')[0];
    return emailPart.slice(0, 2).toUpperCase();
  }

  return '??';
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
  };

  const handleAdminClick = () => {
    router.push('/admin');
  };

  const handleThemeToggle = () => {
    const themeOrder = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme || 'system');
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const getNextTheme = () => {
    const themeOrder = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme || 'system');
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    return themeOrder[nextIndex];
  };

  const getNextThemeIcon = () => {
    const nextTheme = getNextTheme();
    switch (nextTheme) {
      case 'light':
        return <IconSun className="h-4 w-4" />;
      case 'dark':
        return <IconMoon className="h-4 w-4" />;
      case 'system':
        return <IconSettings className="h-4 w-4" />;
      default:
        return <IconSettings className="h-4 w-4" />;
    }
  };

  const getNextThemeLabel = () => {
    const nextTheme = getNextTheme();
    switch (nextTheme) {
      case 'light':
        return 'Switch to Light';
      case 'dark':
        return 'Switch to Dark';
      case 'system':
        return 'Switch to System';
      default:
        return 'Switch to System';
    }
  };

  const initials = getInitials(user.name, user.email);
  const displayName = user.name || 'User';
  const displayEmail = user.email || '';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={displayName} />
                ) : null}
                <AvatarFallback
                  className="rounded-lg text-white font-semibold"
                  style={{ backgroundColor: user.avatarColor || '#4ECDC4' }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {displayEmail}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={displayName} />
                  ) : null}
                  <AvatarFallback
                    className="rounded-lg text-white font-semibold"
                    style={{ backgroundColor: user.avatarColor || '#4ECDC4' }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={handleAdminClick}>
                  <IconSettings />
                  Admin Panel
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleThemeToggle}>
                {getNextThemeIcon()}
                {getNextThemeLabel()}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
