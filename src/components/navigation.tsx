import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="text-xl font-bold">
        AquaKit
      </Link>
      <Button asChild>
        <Link href="/login">
          Login
        </Link>
      </Button>
    </nav>
  );
}