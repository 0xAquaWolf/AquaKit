'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ModeToggle } from '@/components/ThemeToggleButton';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  // Hide login button on auth pages (login, signup, etc.)
  const isAuthPage =
    pathname?.startsWith('/login') || pathname?.startsWith('/signup');

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="text-xl font-bold">
        AquaKit
      </Link>
      <div className="flex items-center gap-2">
        <ModeToggle />
        {!isAuthPage && !session && (
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
