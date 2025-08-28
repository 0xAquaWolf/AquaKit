import { AccountLinkingTest } from '@/components/debug/account-linking-test';

export default function AccountLinkingDebugPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <AccountLinkingTest />
      </div>
    </div>
  );
}
