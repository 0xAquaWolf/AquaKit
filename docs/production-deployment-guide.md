# Production Deployment Guide

This guide outlines the complete process to deploy AquaKit to production, based on real-world experience. Follow these steps in order to ensure a smooth deployment.

## Overview

Deploying AquaKit to production involves several interconnected steps:

1. **Deploy to hosting platform** (Vercel/Netlify/etc.)
2. **Get production URL** from your hosting platform
3. **Update environment variables** with production URLs
4. **Configure OAuth providers** with production callback URLs
5. **Deploy Convex backend** to production
6. **Update local environment** to point to production
7. **Set Convex environment variables** for production

## Step-by-Step Deployment Process

### Step 1: Deploy Frontend to Hosting Platform

Deploy your application to your hosting platform (Vercel, Netlify, etc.):

**For Vercel:**

```bash
# If not already connected
npx vercel

# Deploy to production
npx vercel --prod
```

**For other platforms:** Follow your platform's deployment process.

📝 **Important:** Note down your production URL (e.g., `https://aquakit.vercel.app`)

### Step 2: Update Environment Variables with Production URL

Once you have your production URL, update all environment variables that reference your site URL.

**Update Convex Environment Variables:**

```bash
# Update the site URL in Convex
npx convex env set SITE_URL "https://your-actual-production-url.com"

# Generate a new production auth secret
npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
```

**Update Local Environment (.env.local):**

```bash
# Update your local .env.local file
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud
NEXT_PUBLIC_SITE_URL=https://your-actual-production-url.com
```

### Step 3: Configure OAuth Providers

You need to update **each OAuth provider** with your production callback URLs.

#### GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on your OAuth App (or create a new one for production)
3. Update the settings:
   - **Homepage URL:** `https://your-actual-production-url.com`
   - **Authorization callback URL:** `https://your-actual-production-url.com/api/auth/callback/github`
4. Note down the Client ID and Client Secret

#### Discord OAuth Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application (or create a new one for production)
3. Go to OAuth2 settings
4. Update **Redirects:**
   - Add: `https://your-actual-production-url.com/api/auth/callback/discord`
5. Note down the Client ID and Client Secret

#### Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Click on your OAuth 2.0 Client ID (or create a new one for production)
4. Update:
   - **Authorized JavaScript origins:** `https://your-actual-production-url.com`
   - **Authorized redirect URIs:** `https://your-actual-production-url.com/api/auth/callback/google`
5. Note down the Client ID and Client Secret

### Step 4: Update Convex Environment Variables with OAuth Credentials

Set all the OAuth credentials in your Convex production deployment:

```bash
# GitHub
npx convex env set GITHUB_CLIENT_ID "your-production-github-client-id"
npx convex env set GITHUB_CLIENT_SECRET "your-production-github-client-secret"

# Discord
npx convex env set DISCORD_CLIENT_ID "your-production-discord-client-id"
npx convex env set DISCORD_CLIENT_SECRET "your-production-discord-client-secret"

# Google
npx convex env set GOOGLE_CLIENT_ID "your-production-google-client-id"
npx convex env set GOOGLE_CLIENT_SECRET "your-production-google-client-secret"
```

**Alternative: Use the setup script:**

```bash
npm run env:setup:prod
```

### Step 5: Deploy Convex Backend

Deploy your Convex functions to production:

```bash
npx convex deploy
```

This command:

- Deploys all your functions to the production Convex deployment
- Updates your schema
- Makes your backend available at the production URL

### Step 6: Update Local Environment for Production Testing

Update your local `.env.local` to point to production services:

```bash
# Production Convex URL (from Convex dashboard)
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud

# Your production site URL
NEXT_PUBLIC_SITE_URL=https://your-actual-production-url.com
```

### Step 7: Deploy Frontend Again

After updating all URLs and configurations, redeploy your frontend:

```bash
# For Vercel
npx vercel --prod

# Or trigger a redeploy from your platform's dashboard
```

## Verification Steps

### 1. Check Environment Variables

Verify all environment variables are set correctly:

```bash
# Check Convex production environment variables
npx convex env list

# Should show all your production OAuth credentials and URLs
```

### 2. Test Authentication Flows

1. Visit your production URL
2. Test each OAuth provider (GitHub, Discord, Google)
3. Test email/password authentication
4. Verify user data is being stored correctly

### 3. Check Logs

Monitor your application logs:

```bash
# Check Convex logs
npx convex logs

# Check your hosting platform logs (Vercel, Netlify, etc.)
```

## Important Notes

### Environment Separation

- **Development:** Uses `your-dev-deployment.convex.cloud` and `localhost:3000`
- **Production:** Uses `your-prod-deployment.convex.cloud` and your production domain

### OAuth Security

- **Always use separate OAuth applications** for development and production
- **Never share OAuth secrets** between environments
- **Use strong, unique secrets** for production

### Common Issues and Solutions

#### Issue: "Missing environment variable" error

**Solution:** Ensure all required environment variables are set in Convex:

```bash
npx convex env list
```

#### Issue: OAuth redirect mismatch

**Solution:** Verify that callback URLs in OAuth providers exactly match your production domain.

#### Issue: Authentication fails in production

**Solution:** Check that `SITE_URL` in Convex matches your actual production URL.

## Quick Reference Commands

```bash
# Environment management
npm run env:list          # List production env vars
npm run env:setup:prod    # Interactive production setup

# Deployment
npm run deploy:prod       # Deploy Convex to production
npx vercel --prod         # Deploy frontend to Vercel

# Verification
npx convex logs           # Check Convex logs
npx convex env list       # List all environment variables
```

## Rollback Procedure

If something goes wrong:

1. **Revert frontend deployment** from your hosting platform
2. **Restore previous Convex environment variables:**
   ```bash
   npx convex env set SITE_URL "previous-working-url"
   ```
3. **Redeploy Convex** if needed:
   ```bash
   npx convex deploy
   ```

## Next Steps

After successful deployment:

1. **Set up monitoring** for your production environment
2. **Configure custom domain** if using a hosting platform
3. **Set up SSL certificates** (usually automatic with platforms like Vercel)
4. **Monitor performance** and error rates
5. **Set up backup procedures** for your data

## Resources

- [Convex Deployment Documentation](https://docs.convex.dev/hosting)
- [Environment Setup Guide](./environment-setup.md)
- [GitHub OAuth Setup](./setup-github-oauth.md)
- [Discord OAuth Setup](./setup-discord-oauth.md)
- [Google OAuth Setup](./setup-google-oauth.md)

---

**Pro Tip:** Keep this guide handy for future deployments and share it with your team members who need to deploy to production!
