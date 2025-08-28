'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ModeToggle } from '@/components/ThemeToggleButton';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const pathname = usePathname();

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
        {!isAuthPage && (
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
