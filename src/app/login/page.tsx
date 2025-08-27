import { LoginForm } from '@/components/login-form';
import { Navigation } from '@/components/navigation';

export default function Page() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
