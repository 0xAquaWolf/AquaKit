'use client';

import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useQuery,
} from 'convex/react';

import { useState } from 'react';

import { api } from '@/convex/_generated/api';
import { authClient } from '@/lib/auth-client';
import { Navigation } from '@/components/navigation';
import { TechnologyCards } from '@/components/technology-cards';

export default function App() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen">
          <Navigation />
          <div className="flex items-center justify-center h-96">
            <div>Loading...</div>
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen">
          <Navigation />
          <main className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Welcome to AquaKit</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A modern web application built with cutting-edge technologies for exceptional user experiences.
              </p>
            </div>
            <section>
              <h2 className="text-2xl font-semibold mb-8 text-center">Technologies</h2>
              <TechnologyCards />
            </section>
          </main>
        </div>
      </Unauthenticated>
      <Authenticated>
        <Dashboard />
      </Authenticated>
    </>
  );
}

function Dashboard() {
  const user = useQuery(api.auth.getCurrentUser);
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <div className="mb-4">Hello {user?.name}!</div>
          <button 
            onClick={() => authClient.signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}

function SignIn() {
  const [showSignIn, setShowSignIn] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if (showSignIn) {
      await authClient.signIn.email(
        {
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        },
        {
          onError: (ctx) => {
            console.log(ctx);
            window.alert(ctx.error.message);
          },
        }
      );
    } else {
      await authClient.signUp.email(
        {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        },
        {
          onError: (ctx) => {
            console.log(ctx);
            window.alert(ctx.error.message);
          },
        }
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {!showSignIn && <input name="name" placeholder="Name" />}
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">{showSignIn ? 'Sign in' : 'Sign up'}</button>
      </form>
      <p>
        {showSignIn ? "Don't have an account? " : 'Already have an account? '}
        <button onClick={() => setShowSignIn(!showSignIn)}>
          {showSignIn ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </>
  );
}
