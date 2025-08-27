# Discord OAuth Setup Guide

This guide walks through the steps needed to set up Discord OAuth for your application.

## 1. Navigate to Discord Developer Portal

- Go to [Discord Developer Portal](https://discord.com/developers/applications) and sign in to your Discord account
- Click **New Application** button in the top-right corner
- Enter your application name (e.g., "AquaKit") and click **Create**

## 2. Configure Application Settings

- On the **General Information** tab, you can:
  - Add an application description
  - Upload an app icon and cover image
  - Set tags for your application
- Copy your **Application ID** (this is your Client ID)

## 3. Set Up OAuth2 Configuration

- Navigate to the **OAuth2** tab in the left sidebar
- Under **OAuth2 URL Generator**, select the scopes your application needs:
  - `identify` (access basic user info)
  - `email` (access user's email address)
- Under **Redirects**, add your redirect URI:

For local development, use:

```
http://localhost:3000/api/auth/callback/discord
```

For production, replace with your actual domain:

```
https://yourdomain.com/api/auth/callback/discord
```

## 4. Generate Client Secret

- Still on the **OAuth2** tab, find the **Client Secret** section
- Click **Reset Secret** to generate a new client secret
- Copy the **Client Secret** (keep this private and secure)
- You already have your **Client ID** from the General Information tab

## 5. Configure Bot Settings (Optional)

If your application needs bot functionality:

- Navigate to the **Bot** tab
- Click **Add Bot** if you haven't already
- Configure bot permissions and settings as needed

---

## Quick Reference Table

| Step          | Where                              | Notes                               |
| ------------- | ---------------------------------- | ----------------------------------- |
| Create App    | Developer Portal → New Application | Set application name and basic info |
| General Info  | General Information tab            | Get Application ID (Client ID)      |
| OAuth2 Setup  | OAuth2 tab                         | Set scopes and redirect URIs        |
| Client Secret | OAuth2 tab → Client Secret         | Generate and copy secret            |
| Bot Setup     | Bot tab (optional)                 | Add bot if needed for your app      |

---

## 6. Configure Environment Variables

Once you have your **Client ID** and **Client Secret**, you need to set them up in both your local environment and Convex deployment:

### Local Environment Setup

Add the following variables to your `.env.local` file:

```bash
# Discord OAuth credentials
DISCORD_CLIENT_ID="your-client-id-here"
DISCORD_CLIENT_SECRET="your-client-secret-here"
```

### Convex Environment Setup

Since Convex functions run in their own environment, you also need to set these variables in your Convex deployment:

```bash
npx convex env set DISCORD_CLIENT_ID "your-client-id-here"
npx convex env set DISCORD_CLIENT_SECRET "your-client-secret-here"
```

**Note:** The Convex environment variables are required because the Better Auth configuration in your Convex backend needs access to these credentials to handle OAuth authentication flows.

### Verify Configuration

You can verify your Convex environment variables are set correctly by running:

```bash
npx convex env list
```

This should show your Discord OAuth credentials along with other environment variables like `BETTER_AUTH_SECRET` and `SITE_URL`.

---

## 7. Security Considerations

- **Never commit your Client Secret** to version control
- Store secrets securely in environment variables
- Use different OAuth apps for development and production environments
- Regularly rotate your client secrets for enhanced security
- Review your app's authorized users and permissions periodically
- Be mindful of the scopes you request - only ask for what you need

---

## 8. Additional Discord Features

Discord OAuth provides additional features you might want to utilize:

- **Rich Presence**: Display what users are doing in your app on their Discord profile
- **User Connections**: Access linked accounts (Steam, Spotify, etc.) with appropriate scopes
- **Guild Information**: Access server information if user grants permission

---

Once complete, your application will be able to use Discord sign-in with OAuth authentication through Better Auth and Convex.
