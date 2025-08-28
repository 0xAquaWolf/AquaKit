# Quick Admin Setup for AquaKit

Follow these simple steps to set up admin access for yourself or your team:

## 1. Set Your Admin Email

Run the admin setup script:

```bash
node scripts/setup-admin.js
```

**OR** set it manually:

```bash
# For development
npx convex env set ADMIN_EMAILS "your-email@example.com" --dev

# For production
npx convex env set ADMIN_EMAILS "your-email@example.com" --prod
```

## 2. Create Your Account

- Visit your app and sign up with the same email you configured as admin
- Use any OAuth provider (GitHub, Google, Discord) or email signup

## 3. Initialize Admin Role

- After signing up, visit `/admin` in your app
- Click "Initialize Admin Roles" button
- You now have admin access!

## 4. Access Admin Features

As an admin, you'll see:

- 🔧 **Admin** button in the navigation bar
- Admin dashboard at `/admin` with:
  - User management tools
  - Account linking debug utilities
  - Database operations (dev only)
  - Role assignment capabilities

## 5. Add Team Members as Admins

Update the `ADMIN_EMAILS` environment variable to include multiple emails:

```bash
npx convex env set ADMIN_EMAILS "you@company.com,teammate@company.com,lead@company.com" --dev
```

Each team member follows steps 2-3 above.

## That's it! 🎉

Your admin system is now configured. Check out the [full admin setup guide](./docs/admin-setup.md) for advanced configuration options.
