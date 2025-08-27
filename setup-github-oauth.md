# GitHub OAuth Setup Guide

This guide walks through the steps needed to set up GitHub OAuth for your application.

## 1. Navigate to GitHub Developer Settings

- Go to [GitHub.com](https://github.com) and sign in to your account
- Click on your profile picture in the top-right corner
- Select **Settings** from the dropdown menu
- In the left sidebar, scroll down and click **Developer settings**
- Click **OAuth Apps** in the left sidebar

## 2. Create a New OAuth App

- Click **New OAuth App** button
- Fill out the required application details:
  - **Application name**: Your app's name (e.g., "AquaKit")
  - **Homepage URL**: Your application's homepage (e.g., `http://localhost:3000` for local development)
  - **Application description**: Brief description of your app (optional)
  - **Authorization callback URL**: The redirect URI where GitHub sends users after authorization (e.g., `http://localhost:3000/api/auth/callback/github`)

## 3. Configure Authorization Callback URL

For local development, use:
```
http://localhost:3000/api/auth/callback/github
```

For production, replace with your actual domain:
```
https://yourdomain.com/api/auth/callback/github
```

## 4. Generate Client Credentials

- Click **Register application**
- You'll be redirected to your app's settings page
- Copy the **Client ID** (this is public and safe to expose)
- Click **Generate a new client secret**
- Copy the **Client Secret** (keep this private and secure)

## 5. Update Your Application Settings (Optional)

You can later update your OAuth app settings by:
- Going back to **Settings → Developer settings → OAuth Apps**
- Clicking on your application name
- Updating URLs, description, or regenerating secrets as needed

---

## Quick Reference Table

| Step              | Where                                    | Notes                                    |
| ----------------- | ---------------------------------------- | ---------------------------------------- |
| Developer Settings| Profile → Settings → Developer settings | Access OAuth app management             |
| Create App        | OAuth Apps → New OAuth App              | Fill required fields                     |
| Callback URL      | Authorization callback URL field         | Set correctly for your environment      |
| Credentials       | App settings page                        | Copy Client ID and generate secret      |
| Update Settings   | OAuth Apps → Your app name              | Modify configuration as needed           |

---

## 6. Configure Environment Variables

Once you have your **Client ID** and **Client Secret**, you need to set them up in both your local environment and Convex deployment:

### Local Environment Setup

Add the following variables to your `.env.local` file:

```bash
# GitHub OAuth credentials
GITHUB_CLIENT_ID="your-client-id-here"
GITHUB_CLIENT_SECRET="your-client-secret-here"
```

### Convex Environment Setup

Since Convex functions run in their own environment, you also need to set these variables in your Convex deployment:

```bash
npx convex env set GITHUB_CLIENT_ID "your-client-id-here"
npx convex env set GITHUB_CLIENT_SECRET "your-client-secret-here"
```

**Note:** The Convex environment variables are required because the Better Auth configuration in your Convex backend needs access to these credentials to handle OAuth authentication flows.

### Verify Configuration

You can verify your Convex environment variables are set correctly by running:

```bash
npx convex env list
```

This should show your GitHub OAuth credentials along with other environment variables like `BETTER_AUTH_SECRET` and `SITE_URL`.

---

## 7. Security Considerations

- **Never commit your Client Secret** to version control
- Store secrets securely in environment variables
- Use different OAuth apps for development and production environments
- Regularly rotate your client secrets for enhanced security
- Review your app's authorized users and permissions periodically

---

Once complete, your application will be able to use GitHub sign-in with OAuth authentication through Better Auth and Convex.