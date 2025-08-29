import { Suspense } from 'react';

import { LoginForm } from '@/components/login-form';
import { Navigation } from '@/components/navigation';

export default function Page() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Suspense fallback={
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
