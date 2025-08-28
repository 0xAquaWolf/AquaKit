# Admin Components Guide

This guide explains how to use the admin protection components in AquaKit to create admin-only pages and features.

## Components Overview

### AdminGuard

The `AdminGuard` component provides authentication and admin role verification for any content.

### AdminPageLayout

The `AdminPageLayout` component provides a consistent layout for admin pages with built-in AdminGuard protection.

## Usage Examples

### Option 1: Using AdminGuard (Flexible Layout)

Use this when you need full control over the page layout:

```tsx
// src/app/admin/custom-admin-page/page.tsx
import { AdminGuard } from '@/components/admin/admin-guard';
import { MyCustomComponent } from '@/components/my-custom-component';

export default function CustomAdminPage() {
  return (
    <AdminGuard
      title="Custom Admin Access"
      description="You need admin privileges to access this custom admin page."
    >
      <div className="custom-layout">
        <MyCustomComponent />
      </div>
    </AdminGuard>
  );
}
```

### Option 2: Using AdminPageLayout (Standard Layout)

Use this for consistent admin page styling:

```tsx
// src/app/admin/user-management/page.tsx
import { AdminPageLayout } from '@/components/admin/admin-page-layout';
import { UserManagement } from '@/components/admin/user-management';

export default function UserManagementPage() {
  return (
    <AdminPageLayout
      title="User Management Access Required"
      description="You need admin privileges to manage users."
    >
      <UserManagement />
    </AdminPageLayout>
  );
}
```

### Option 3: Protecting Individual Components

Use AdminGuard to protect specific sections within a page:

```tsx
// src/app/dashboard/page.tsx
import { AdminTools } from '@/components/admin-tools';
import { AdminGuard } from '@/components/admin/admin-guard';
import { UserDashboard } from '@/components/user-dashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      {/* Regular user content */}
      <UserDashboard />

      {/* Admin-only section */}
      <AdminGuard
        title="Admin Tools Access"
        description="Admin tools are only available to administrators."
      >
        <AdminTools />
      </AdminGuard>
    </div>
  );
}
```

## Component Props

### AdminGuard Props

| Prop          | Type              | Default                                            | Description                                |
| ------------- | ----------------- | -------------------------------------------------- | ------------------------------------------ |
| `children`    | `React.ReactNode` | Required                                           | The content to protect                     |
| `title`       | `string`          | `"Admin Access Required"`                          | Title shown in access denied message       |
| `description` | `string`          | `"You need admin privileges to access this page."` | Description shown in access denied message |

### AdminPageLayout Props

| Prop          | Type              | Default                                            | Description                                |
| ------------- | ----------------- | -------------------------------------------------- | ------------------------------------------ |
| `children`    | `React.ReactNode` | Required                                           | The page content                           |
| `title`       | `string`          | `"Admin Access Required"`                          | Title shown in access denied message       |
| `description` | `string`          | `"You need admin privileges to access this page."` | Description shown in access denied message |

## Protection Behavior

### Authentication States

1. **Unauthenticated Users**: Redirected to login page
2. **Authenticated Non-Admins**: Shown access denied message with link to dashboard
3. **Authenticated Admins**: See the protected content
4. **Loading State**: Loading spinner while checking admin status

### Access Determination

A user is considered an admin if:

- Their user record has `role: 'admin'` in the database, OR
- Their email appears in the `ADMIN_EMAILS` environment variable

## Best Practices

### 1. Use Appropriate Component for Your Needs

- **AdminGuard**: When you need custom layouts or want to protect part of a page
- **AdminPageLayout**: When you want consistent admin page styling

### 2. Customize Messages

Provide meaningful titles and descriptions:

```tsx
<AdminGuard
  title="Financial Reports Access"
  description="You need admin privileges to view financial reports and analytics."
>
  <FinancialReports />
</AdminGuard>
```

### 3. Consistent Admin Navigation

Use the same navigation structure across admin pages:

```tsx
<AdminPageLayout>
  <div className="space-y-6">
    <AdminPageHeader title="User Management" />
    <AdminTabs />
    <UserManagementContent />
  </div>
</AdminPageLayout>
```

### 4. Error Boundaries

Consider wrapping admin components with error boundaries for better UX:

```tsx
<AdminGuard>
  <ErrorBoundary fallback={<AdminErrorFallback />}>
    <AdminContent />
  </ErrorBoundary>
</AdminGuard>
```

## Security Notes

- These components only provide **UI-level protection**
- Always implement **server-side protection** in your Convex functions
- Use the `isCurrentUserAdmin` query and admin role checks in mutations
- Never rely solely on frontend protection for sensitive operations

## Creating New Admin Pages

### Step 1: Create the Page Component

```tsx
// src/app/admin/my-feature/page.tsx
import { AdminPageLayout } from '@/components/admin/admin-page-layout';
import { MyFeatureComponent } from '@/components/admin/my-feature';

export default function MyFeaturePage() {
  return (
    <AdminPageLayout
      title="My Feature Access Required"
      description="You need admin privileges to access this feature."
    >
      <MyFeatureComponent />
    </AdminPageLayout>
  );
}
```

### Step 2: Add Navigation Link

Update your admin navigation to include the new page:

```tsx
// In your admin navigation component
<Link href="/admin/my-feature" className="admin-nav-link">
  My Feature
</Link>
```

### Step 3: Implement Backend Protection

Ensure your Convex functions also check admin status:

```tsx
// convex/my-feature.ts
export const adminOnlyMutation = mutation({
  args: {
    /* your args */
  },
  handler: async (ctx, args) => {
    // Check admin status
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db.get(userMetadata.userId as Id<'users'>);
    const adminEmails =
      process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()) || [];
    const isAdmin =
      user?.role === 'admin' || adminEmails.includes(user?.email || '');

    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    // Your admin-only logic here
  },
});
```

This ensures both frontend and backend protection for your admin features.
