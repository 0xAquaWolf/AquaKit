# Admin Setup Guide

This guide explains how to set up admin users in your AquaKit application, allowing specific users to access debug tools and admin panels.

## Overview

The admin system in AquaKit allows you to:

- Designate specific users as administrators
- Provide admin-only access to debug tools and management panels
- Manage user roles and permissions
- Access advanced debugging features

## Quick Setup

### Method 1: Using the Setup Script (Recommended)

Run the interactive setup script:

```bash
node scripts/setup-admin.js
```

The script will:

1. Ask for admin email addresses
2. Set the `ADMIN_EMAILS` environment variable in Convex
3. Guide you through the configuration process

### Method 2: Manual Setup

1. **Set the Admin Emails Environment Variable**

   For development:

   ```bash
   npx convex env set ADMIN_EMAILS "your-email@company.com,teammate@company.com" --dev
   ```

   For production:

   ```bash
   npx convex env set ADMIN_EMAILS "your-email@company.com,teammate@company.com" --prod
   ```

2. **Initialize Admin Roles**

   After setting the environment variable:
   - Log in to your application with one of the admin emails
   - Navigate to `/admin` (the admin button should appear in navigation)
   - Click "Initialize Admin Roles" to set admin permissions

## How It Works

### 1. Environment Variable Configuration

The `ADMIN_EMAILS` environment variable contains a comma-separated list of email addresses that should have admin access:

```
ADMIN_EMAILS=john@company.com,jane@company.com,admin@company.com
```

### 2. Admin Role Detection

The system determines admin status through two methods:

1. **Database Role**: Users with `role: 'admin'` in the database
2. **Environment Variable**: Users whose email appears in `ADMIN_EMAILS`

### 3. Admin Features

Admin users get access to:

- **Admin Dashboard** (`/admin`): Comprehensive admin panel
- **Debug Tools**: Account linking diagnostics
- **User Management**: Role assignment and user overview
- **Database Operations**: Development-only cleanup tools

## Admin Dashboard Features

### User Management

- View all users in the system
- Search users by email
- Promote/demote user roles
- View authentication methods

### Debug Tools

- OAuth provider linking (Google, GitHub, Discord)
- Account linking diagnostics
- Email search and duplicate detection
- User creation and deletion tracking
- Authentication method analysis

### Development Tools

- Clear all users (development only)
- Initialize admin roles
- Environment configuration

## Admin Components

AquaKit provides reusable components for protecting admin content:

### AdminGuard

Protects any content with admin authentication and role verification:

```tsx
import { AdminGuard } from '@/components/admin/admin-guard';

<AdminGuard title="Custom Access" description="Admin only content">
  <YourAdminContent />
</AdminGuard>;
```

### AdminPageLayout

Provides consistent styling for admin pages with built-in protection:

```tsx
import { AdminPageLayout } from '@/components/admin/admin-page-layout';

<AdminPageLayout title="Page Title" description="Page description">
  <YourPageContent />
</AdminPageLayout>;
```

See the [Admin Components Guide](./admin-components.md) for detailed usage examples.

## Security Considerations

### Production Safety

- Admin panels include safety checks for production environments
- Destructive operations are restricted to development deployments
- Role changes require admin authentication

### Access Control

- Admin links only appear for authenticated admin users
- Admin pages redirect non-admins to the dashboard
- All admin operations validate user permissions

## Adding New Admins

### For Existing Users

1. Add their email to the `ADMIN_EMAILS` environment variable
2. Update the environment variable in Convex
3. Have them log in and visit `/admin`
4. Click "Initialize Admin Roles"

### For New Team Members

1. Add their email to `ADMIN_EMAILS` before they first sign up
2. When they create an account, they'll automatically have admin access
3. Alternatively, promote them after account creation using the admin dashboard

## Troubleshooting

### Admin Button Not Appearing

- Verify the user's email is in `ADMIN_EMAILS`
- Check that the environment variable is set correctly: `npx convex env list`
- Ensure the user is logged in
- Try clicking "Initialize Admin Roles" in the admin dashboard

### Access Denied to Admin Panel

- Confirm the user's email matches exactly (case-sensitive)
- Verify the environment variable is deployed to the correct environment
- Check the browser console for any errors

### Environment Variable Issues

- List current environment variables: `npx convex env list`
- Verify the format is correct (comma-separated, no spaces around commas)
- Ensure you're deploying to the correct environment (dev vs prod)

## Development vs Production

### Development Environment

- Use `--dev` flag when setting environment variables
- Access to destructive operations like "Clear All Users"
- More permissive safety checks

### Production Environment

- Use `--prod` flag when setting environment variables
- Destructive operations are disabled
- Additional safety checks and confirmations

## Best Practices

1. **Limit Admin Access**: Only grant admin access to users who need it
2. **Use Development First**: Test admin features in development before production
3. **Keep Emails Updated**: Remove admin access when team members leave
4. **Regular Audits**: Periodically review who has admin access
5. **Secure Environment Variables**: Treat `ADMIN_EMAILS` as sensitive configuration

## Integration with Starter Kit

This admin system is designed to be a starter kit feature that other developers can easily configure:

1. **Clone the repository**
2. **Run the setup script**: `node scripts/setup-admin.js`
3. **Add your email** to the admin list
4. **Deploy and test** in development
5. **Configure production** when ready

The system automatically handles role detection and provides a clean interface for managing admin access without code changes.
