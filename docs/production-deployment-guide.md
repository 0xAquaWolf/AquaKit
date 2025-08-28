# Production Deployment Guide

This guide outlines the complete process to deploy AquaKit to production, based on real-world experience. Follow these steps in order to ensure a smooth deployment.

## Overview

Deploying AquaKit to production with a custom domain involves several interconnected steps. This guide is based on real deployment experience using aquakit.com as the production domain.

**Key Requirement:** You will need **three separate OAuth applications** for each provider:
- **Development:** localhost:3000
- **Staging:** your-staging-domain.vercel.app  
- **Production:** your-custom-domain.com

### Deployment Steps:

1. **Set up custom domain** with your hosting provider
2. **Create separate OAuth applications** for all three environments  
3. **Update Convex environment variables** for both staging and production
4. **Update hosting platform environment variables** (Vercel/Netlify/etc.)
5. **Configure OAuth providers** with custom domain callback URLs
6. **Deploy Convex backend** to production
7. **Test authentication flows** across all environments

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

📝 **Important:** You now have two domains to manage:
- **Staging URL:** `https://your-app.vercel.app` (or your platform's domain)
- **Production URL:** `https://your-custom-domain.com` (e.g., `https://aquakit.com`)

### Step 2: Set Up Custom Domain

Configure your custom domain with your hosting provider:

**For Vercel:**
1. Go to your project settings in Vercel Dashboard
2. Navigate to "Domains" section
3. Add **BOTH** your domain variations:
   - `your-custom-domain.com` (e.g., `aquakit.com`)
   - `www.your-custom-domain.com` (e.g., `www.aquakit.com`)
4. Configure DNS records as instructed by Vercel
5. Wait for SSL certificate provisioning

🚨 **Critical:** You MUST add both the root domain AND the www subdomain to Vercel. OAuth providers need to handle redirects to both variations, and users may visit either URL.

### Step 3: Update Environment Variables for Both Environments

You now need to manage environment variables for both staging and production:

**Update Convex Environment Variables for Production:**

```bash
# Update the site URL in Convex to your custom domain
npx convex env set SITE_URL "https://your-custom-domain.com"

# Generate a new production auth secret
npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
```

**Update Hosting Platform Environment Variables (e.g., Vercel):**

In your Vercel Dashboard > Settings > Environment Variables:
- `NEXT_PUBLIC_SITE_URL`: `https://your-custom-domain.com`
- `CONVEX_SITE_URL`: `https://your-custom-domain.com`

**Note:** Keep separate environment variable configurations for:
- **Staging:** Uses your Vercel domain (`your-app.vercel.app`)
- **Production:** Uses your custom domain (`your-custom-domain.com`)

### Step 4: Create Separate OAuth Applications

You need to create **three separate OAuth applications** for each provider to handle development, staging, and production environments properly.

**Why separate applications?**
- Different callback URLs for each environment
- Better security isolation
- Easier debugging and management

**Environment URLs:**
- **Development:** `http://localhost:3000`
- **Staging:** `https://your-app.vercel.app`  
- **Production:** `https://your-custom-domain.com`

#### GitHub OAuth Applications

Create **three separate GitHub OAuth applications**:

**1. Development Application:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Configure:
   - **Application name:** `AquaKit Development`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Note down the Client ID and Client Secret

**2. Staging Application:**
1. Create another "New OAuth App"
2. Configure:
   - **Application name:** `AquaKit Staging`
   - **Homepage URL:** `https://your-app.vercel.app`
   - **Authorization callback URL:** `https://your-app.vercel.app/api/auth/callback/github`
3. Note down the Client ID and Client Secret

**3. Production Application:**
1. Create another "New OAuth App"
2. Configure:
   - **Application name:** `AquaKit Production`
   - **Homepage URL:** `https://your-custom-domain.com`
   - **Authorization callback URL:** `https://your-custom-domain.com/api/auth/callback/github`
3. **IMPORTANT:** Add a second callback URL for www subdomain:
   - Click "Update application" 
   - Add additional callback URL: `https://www.your-custom-domain.com/api/auth/callback/github`
4. Note down the Client ID and Client Secret

#### Discord OAuth Applications

Create **three separate Discord applications**:

**1. Development Application:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it `AquaKit Development`
3. Go to OAuth2 settings
4. Add **Redirects:**
   - `http://localhost:3000/api/auth/callback/discord`
5. Note down the Client ID and Client Secret

**2. Staging Application:**
1. Create "New Application" named `AquaKit Staging`
2. Go to OAuth2 settings
3. Add **Redirects:**
   - `https://your-app.vercel.app/api/auth/callback/discord`
4. Note down the Client ID and Client Secret

**3. Production Application:**
1. Create "New Application" named `AquaKit Production`
2. Go to OAuth2 settings
3. Add **Redirects:**
   - `https://your-custom-domain.com/api/auth/callback/discord`
   - `https://www.your-custom-domain.com/api/auth/callback/discord`
4. Note down the Client ID and Client Secret

#### Google OAuth Applications

Create **three separate Google OAuth clients**:

**1. Development Client:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Click "Create Credentials" > "OAuth 2.0 Client IDs"
4. Configure:
   - **Name:** `AquaKit Development`
   - **Authorized JavaScript origins:** `http://localhost:3000`
   - **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`
5. Note down the Client ID and Client Secret

**2. Staging Client:**
1. Create another "OAuth 2.0 Client ID"
2. Configure:
   - **Name:** `AquaKit Staging`
   - **Authorized JavaScript origins:** `https://your-app.vercel.app`
   - **Authorized redirect URIs:** `https://your-app.vercel.app/api/auth/callback/google`
3. Note down the Client ID and Client Secret

**3. Production Client:**
1. Create another "OAuth 2.0 Client ID"
2. Configure:
   - **Name:** `AquaKit Production`
   - **Authorized JavaScript origins:** 
     - `https://your-custom-domain.com`
     - `https://www.your-custom-domain.com`
   - **Authorized redirect URIs:** 
     - `https://your-custom-domain.com/api/auth/callback/google`
     - `https://www.your-custom-domain.com/api/auth/callback/google`
3. Note down the Client ID and Client Secret

### Step 5: Update Convex Environment Variables with OAuth Credentials

Set the OAuth credentials for your production environment in Convex:

```bash
# GitHub Production Credentials
npx convex env set GITHUB_CLIENT_ID "your-production-github-client-id"
npx convex env set GITHUB_CLIENT_SECRET "your-production-github-client-secret"

# Discord Production Credentials
npx convex env set DISCORD_CLIENT_ID "your-production-discord-client-id"
npx convex env set DISCORD_CLIENT_SECRET "your-production-discord-client-secret"

# Google Production Credentials
npx convex env set GOOGLE_CLIENT_ID "your-production-google-client-id"
npx convex env set GOOGLE_CLIENT_SECRET "your-production-google-client-secret"
```

**Important:** Make sure you're using the **production** OAuth credentials (from your custom domain OAuth apps), not the staging or development ones.

**Alternative: Use the setup script:**

```bash
npm run env:setup:prod
```

### Step 6: Deploy Convex Backend

Deploy your Convex functions to production:

```bash
npx convex deploy
```

This command:

- Deploys all your functions to the production Convex deployment
- Updates your schema
- Makes your backend available at the production URL

### Step 7: Update Local Environment for Production Testing

Update your local `.env.local` to point to production services:

```bash
# Production Convex URL (from Convex dashboard)
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud

# Your production site URL
NEXT_PUBLIC_SITE_URL=https://your-actual-production-url.com
```

### Step 8: Deploy Frontend Again

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

**For Staging Environment:**
1. Visit your staging URL (`https://your-app.vercel.app`)
2. Test each OAuth provider with staging credentials
3. Test email/password authentication
4. Verify user data is being stored correctly

**For Production Environment:**
1. Visit your custom domain (`https://your-custom-domain.com`)
2. Test each OAuth provider (GitHub, Discord, Google) with production credentials
3. Test email/password authentication
4. Verify user data is being stored correctly
5. **Critical:** Ensure SSL certificate is working (no browser warnings)
6. Test that redirects work properly with your custom domain

### 3. Check Logs

Monitor your application logs:

```bash
# Check Convex logs
npx convex logs

# Check your hosting platform logs (Vercel, Netlify, etc.)
```

## Important Notes

### Environment Separation

With a custom domain, you now manage three distinct environments:

- **Development:** 
  - Frontend: `http://localhost:3000`
  - Backend: `your-dev-deployment.convex.cloud`
  - OAuth Apps: Development applications
  
- **Staging:** 
  - Frontend: `https://your-app.vercel.app` (or platform domain)
  - Backend: `your-prod-deployment.convex.cloud` (can be shared with production)
  - OAuth Apps: Staging applications
  
- **Production:** 
  - Frontend: `https://your-custom-domain.com`
  - Backend: `your-prod-deployment.convex.cloud`
  - OAuth Apps: Production applications

**Key Insight:** The main difference between staging and production is the frontend domain and OAuth applications. The Convex backend can be shared, but environment variables should point to the correct domain.

### OAuth Security

- **Always use separate OAuth applications** for development, staging, and production
- **Never share OAuth secrets** between environments
- **Use strong, unique secrets** for production
- **Test each environment independently** to ensure callback URLs work correctly
- **Use descriptive names** for OAuth applications (e.g., "AquaKit Production") to avoid confusion

### Common Issues and Solutions

#### Issue: "Missing environment variable" error

**Solution:** Ensure all required environment variables are set in Convex:

```bash
npx convex env list
```

#### Issue: OAuth redirect mismatch

**Solution:** 
- Verify that callback URLs in OAuth providers exactly match your domain
- For staging: Use `https://your-app.vercel.app/api/auth/callback/[provider]`
- For production: Use `https://your-custom-domain.com/api/auth/callback/[provider]`
- Ensure you're using the correct OAuth application for each environment

#### Issue: Authentication fails in production

**Solution:** 
- Check that `SITE_URL` in Convex matches your custom domain
- Verify that `CONVEX_SITE_URL` in your hosting platform matches your custom domain
- Ensure you're using production OAuth credentials, not staging/development ones
- Check that your custom domain's SSL certificate is properly configured

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

After successful custom domain deployment:

1. **Set up monitoring** for your production environment
2. **Configure DNS monitoring** to ensure your custom domain stays operational
3. **Set up SSL certificate monitoring** (automatic renewal with most platforms)
4. **Monitor performance** and error rates across both staging and production
5. **Set up backup procedures** for your data
6. **Document your OAuth application credentials** securely for your team
7. **Set up staging environment testing** as part of your deployment pipeline

## Resources

- [Convex Deployment Documentation](https://docs.convex.dev/hosting)
- [Environment Setup Guide](./environment-setup.md)
- [GitHub OAuth Setup](./setup-github-oauth.md)
- [Discord OAuth Setup](./setup-discord-oauth.md)
- [Google OAuth Setup](./setup-google-oauth.md)

---

**Pro Tips:** 
- Keep this guide handy for future deployments and share it with your team members
- Always test on staging before deploying to production with your custom domain
- Document your OAuth application credentials in a secure location (like a password manager)
- Consider setting up automated deployments that test staging before promoting to production
- Your custom domain setup is a one-time process, but OAuth applications will need to be maintained
