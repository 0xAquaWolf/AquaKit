'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [showSignIn, setShowSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      if (showSignIn) {
        await authClient.signIn.email(
          {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
          },
          {
            onError: (ctx) => {
              console.error('Sign in error:', ctx);
              setError(ctx.error.message || 'Failed to sign in');
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
              console.error('Sign up error:', ctx);
              setError(ctx.error.message || 'Failed to sign up');
            },
          }
        );
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{showSignIn ? 'Login to your account' : 'Create an account'}</CardTitle>
          <CardDescription>
            {showSignIn 
              ? 'Enter your email below to login to your account'
              : 'Enter your information below to create your account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              {!showSignIn && (
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                  />
                </div>
              )}
              
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {showSignIn && (
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Please wait...' : (showSignIn ? 'Login' : 'Sign up')}
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              {showSignIn ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setShowSignIn(!showSignIn);
                  setError(null);
                }}
                className="underline underline-offset-4 hover:text-primary"
              >
                {showSignIn ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
