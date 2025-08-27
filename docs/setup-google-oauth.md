# Google OAuth Setup Guide

This guide walks through the steps needed to set up Google OAuth in the Google Cloud Console for a new or existing application.

## 1. Create or Select a Project

- Click the project drop-down at the top of the Google Cloud Console.
- Select an existing project or create a new project for your OAuth app.

## 2. Configure the OAuth Consent Screen

- Navigate to **APIs & Services > OAuth Consent Screen** in the left sidebar.
- Fill out the required details: _App name, support email, and contact info_. Optionally add branding information such as a logo.
- Choose your **User Type**: Internal (organization only) or External (public).
- (Optional) Add test users if you're in testing mode.
- Click **Save and Continue** to proceed.

## 3. Set Up Scopes

- In the consent screen setup, specify the data your app will request by adding scopes:
  - `email` (access user's email)
  - `profile` (access basic profile info)
  - `openid` (OpenID Connect)
- Choose the least sensitive scopes needed for your app.

## 4. Create OAuth Client Credentials

- Go to **APIs & Services > Credentials** in the sidebar.
- Click **Create Credentials → OAuth Client ID**.
- Choose the application type (typically **Web Application**).
- Set your **Authorized JavaScript origins** (e.g., `http://localhost:3000` for local testing).
- Set your **Authorized redirect URIs** (where Google redirects after sign-in, e.g., `http://localhost:3000/api/auth/callback/google`).
- Click **Create**. Copy and save your **Client ID** and **Client Secret** for your application.

## 5. Finalize and Test

- For apps with 'External' consent screens, sensitive scopes or more than 100 users may require Google verification.
- Use test users to try out the sign-in flow before launching publicly.

---

## Quick Reference Table

| Step           | Where                           | Notes                                    |
| -------------- | ------------------------------- | ---------------------------------------- |
| Project        | Project dropdown (top)          | New or existing project                  |
| Consent Screen | APIs & Services → OAuth Consent | Required fields, add branding            |
| Scopes         | Consent Screen setup            | Add necessary scopes                     |
| Credentials    | APIs & Services → Credentials   | Create OAuth Client ID                   |
| Origins/URIs   | Client ID creation              | Set URLs accurately for sign-in/redirect |
| Finalize/Test  | Save, verify                    | Use test users, submit for verification  |

---

## 6. Configure Environment Variables

Once you have your **Client ID** and **Client Secret**, you need to set them up in both your local environment and Convex deployment:

### Local Environment Setup

Add the following variables to your `.env.local` file:

```bash
# Google OAuth credentials
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

### Convex Environment Setup

Since Convex functions run in their own environment, you also need to set these variables in your Convex deployment:

```bash
npx convex env set GOOGLE_CLIENT_ID "your-client-id-here"
npx convex env set GOOGLE_CLIENT_SECRET "your-client-secret-here"
```

**Note:** The Convex environment variables are required because the Better Auth configuration in your Convex backend needs access to these credentials to handle OAuth authentication flows.

### Verify Configuration

You can verify your Convex environment variables are set correctly by running:

```bash
npx convex env list
```

This should show your Google OAuth credentials along with other environment variables like `BETTER_AUTH_SECRET` and `SITE_URL`.

---

Once complete, your application will be able to use Google sign-in with OAuth authentication through Better Auth and Convex.
