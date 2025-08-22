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

export default function App() {
  return (
    <>
      <AuthLoading>
        <div>Loading...</div>
      </AuthLoading>
      <Unauthenticated>
        <SignIn />
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
    <div>
      <div>Hello {user?.name}!</div>
      <button onClick={() => authClient.signOut()}>Sign out</button>
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
