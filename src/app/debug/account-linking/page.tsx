import { AdminPageLayout } from '@/components/admin/admin-page-layout';
import { AccountLinkingTest } from '@/components/debug/account-linking-test';

export default function AccountLinkingDebugPage() {
  return (
    <AdminPageLayout
      title="Debug Access Required"
      description="You need admin privileges to access debug tools."
    >
      <AccountLinkingTest />
    </AdminPageLayout>
  );
}
