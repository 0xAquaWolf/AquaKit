# Environment Setup Guide

This guide explains how to manage environment variables for development and production deployments in AquaKit.

## Overview

AquaKit uses Convex for backend services, which provides separate development and production deployments. Each deployment has its own set of environment variables.

## Environment Variables

### Required Variables

| Variable                | Description                   | Example                   |
| ----------------------- | ----------------------------- | ------------------------- |
| `SITE_URL`              | Base URL for your application | `https://your-domain.com` |
| `BETTER_AUTH_SECRET`    | Secret key for Better Auth    | Generated automatically   |
| `GITHUB_CLIENT_ID`      | GitHub OAuth App Client ID    | `Ov23li...`               |
| `GITHUB_CLIENT_SECRET`  | GitHub OAuth App Secret       | `1f3e89...`               |
| `DISCORD_CLIENT_ID`     | Discord OAuth App Client ID   | `141009...`               |
| `DISCORD_CLIENT_SECRET` | Discord OAuth App Secret      | `_7EOiW...`               |
| `GOOGLE_CLIENT_ID`      | Google OAuth Client ID        | `858912771043-...`        |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth Client Secret    | `GOCSPX-...`              |

### Frontend Environment Variables (.env.local)

Create a `.env.local` file in your project root:

```bash
# Development
NEXT_PUBLIC_CONVEX_URL=https://quaint-rabbit-453.convex.cloud
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production
# NEXT_PUBLIC_CONVEX_URL=https://oceanic-cormorant-345.convex.cloud
# NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

## Setup Instructions

### 1. Development Environment

Your development environment should already be configured. To verify:

```bash
npx convex env list --dev
```

### 2. Production Environment

#### Step 1: Enable Production Deployment

1. Open Convex Dashboard: `npx convex dashboard`
2. Navigate to your project settings
3. Enable production deployments
4. Note your production URL (e.g., `https://oceanic-cormorant-345.convex.cloud`)

#### Step 2: Set Production Environment Variables

**Option A: Using the Setup Script (Recommended)**

```bash
node scripts/setup-env.js prod
```

**Option B: Manual Setup**

```bash
# Set each variable for production
npx convex env set SITE_URL "https://your-production-domain.com"
npx convex env set BETTER_AUTH_SECRET "your-secret-key"
npx convex env set GITHUB_CLIENT_ID "your-github-client-id"
npx convex env set GITHUB_CLIENT_SECRET "your-github-client-secret"
npx convex env set DISCORD_CLIENT_ID "your-discord-client-id"
npx convex env set DISCORD_CLIENT_SECRET "your-discord-client-secret"
npx convex env set GOOGLE_CLIENT_ID "your-google-client-id"
npx convex env set GOOGLE_CLIENT_SECRET "your-google-client-secret"
```

#### Step 3: Update OAuth Redirect URLs

Update your OAuth application settings with production URLs:

**GitHub OAuth App:**

- Homepage URL: `https://your-production-domain.com`
- Authorization callback URL: `https://your-production-domain.com/api/auth/callback/github`

**Discord OAuth App:**

- Redirect URI: `https://your-production-domain.com/api/auth/callback/discord`

**Google OAuth App:**

- Authorized JavaScript origins: `https://your-production-domain.com`
- Authorized redirect URIs: `https://your-production-domain.com/api/auth/callback/google`

### 3. Deploy to Production

```bash
# Deploy to production
npx convex deploy

# Verify deployment
npx convex env list
```

## Environment Management Commands

```bash
# List environment variables
npx convex env list           # Production
npx convex env list --dev     # Development

# Set environment variable
npx convex env set KEY "value"      # Production
npx convex env set --dev KEY "value" # Development

# Remove environment variable
npx convex env remove KEY     # Production
npx convex env remove --dev KEY # Development

# Get specific variable
npx convex env get KEY        # Production
npx convex env get --dev KEY  # Development
```

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use different OAuth applications** for development and production
3. **Rotate secrets regularly**, especially for production
4. **Use strong, unique secrets** for `BETTER_AUTH_SECRET`
5. **Restrict OAuth redirect URLs** to your actual domains only

## Troubleshooting

### Common Issues

1. **"Missing environment variable" error**
   - Ensure all required variables are set for the target environment
   - Check variable names for typos

2. **OAuth redirect mismatch**
   - Verify redirect URLs in OAuth app settings match your environment
   - Ensure `SITE_URL` matches your actual domain

3. **Production deployment disabled**
   - Enable production deployments in Convex Dashboard
   - Contact Convex support if you need assistance

### Verification

Test your environment setup:

```bash
# Check backend variables
npx convex env list

# Test authentication locally
npm run dev

# Test production deployment
npx convex deploy --dry-run
```

## Next Steps

After setting up your environment variables:

1. Update your hosting platform (Vercel, Netlify, etc.) with production Convex URL
2. Configure your domain and SSL certificates
3. Test all authentication flows in production
4. Monitor your application logs for any issues

For more detailed OAuth setup instructions, see:

- [GitHub OAuth Setup](./setup-github-oauth.md)
- [Discord OAuth Setup](./setup-discord-oauth.md)
- [Google OAuth Setup](./setup-google-oauth.md)
