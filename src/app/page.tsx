'use client';

import { AuthLoading, Authenticated, Unauthenticated } from 'convex/react';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Navigation } from '@/components/navigation';
import { TechnologyCards } from '@/components/technology-cards';
import { TechnologyCardsSkeleton } from '@/components/technology-cards-skeleton';

export default function App() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen">
          <Navigation />
          <main className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Welcome to AquaKit</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A modern web application built with cutting-edge technologies
                for exceptional user experiences.
              </p>
            </div>
            <section>
              <h2 className="text-2xl font-semibold mb-8 text-center">
                Technologies
              </h2>
              <TechnologyCardsSkeleton />
            </section>
          </main>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen">
          <Navigation />
          <main className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Welcome to AquaKit</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A modern web application built with cutting-edge technologies
                for exceptional user experiences.
              </p>
            </div>
            <section>
              <h2 className="text-2xl font-semibold mb-8 text-center">
                Technologies
              </h2>
              <TechnologyCards />
            </section>
          </main>
        </div>
      </Unauthenticated>
      <Authenticated>
        <RedirectToDashboard />
      </Authenticated>
    </>
  );
}

function RedirectToDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex items-center justify-center h-96">
        <div>Redirecting to dashboard...</div>
      </div>
    </div>
  );
}
