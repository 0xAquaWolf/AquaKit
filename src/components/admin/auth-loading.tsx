'use client';

import { Loader2 } from 'lucide-react';

export function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <div className="text-sm text-muted-foreground">
          Checking authentication...
        </div>
      </div>
    </div>
  );
}