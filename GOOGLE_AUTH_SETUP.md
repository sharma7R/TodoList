# Google Authentication Setup Guide

This guide will help you set up Google OAuth authentication for your TodoList application using Supabase.

## Prerequisites

- A Supabase project
- A Google Cloud Console project
- Your application running locally

## Step 1: Set up Google OAuth in Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type
   - Add authorized redirect URIs:
     - For development: `http://localhost:5173/auth/callback`
     - For production: `https://yourdomain.com/auth/callback`
   - Note down your Client ID and Client Secret

## Step 2: Configure Supabase Authentication

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list and click "Edit"
4. Enable Google authentication by toggling the switch
5. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
6. Save the configuration

## Step 3: Update Environment Variables

Make sure your `.env` file contains the correct Supabase URL and anon key:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/login` or `/signup`
3. Click the "Sign in with Google" or "Sign up with Google" button
4. You should be redirected to Google's OAuth consent screen
5. After successful authentication, you'll be redirected back to your application

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**:
   - Make sure the redirect URI in Google Cloud Console matches exactly: `http://localhost:5173/auth/callback`
   - Check that your Supabase project URL is correct

2. **"Client ID not found" error**:
   - Verify that the Client ID and Client Secret are correctly entered in Supabase
   - Ensure the Google+ API is enabled in Google Cloud Console

3. **Authentication callback not working**:
   - Check that the `/auth/callback` route is properly configured in your app
   - Verify that your Supabase project is in the correct region

### Security Notes:

- Never commit your Google Client Secret to version control
- Use environment variables for sensitive configuration
- Regularly rotate your OAuth credentials
- Set up proper CORS policies in production

## Production Deployment

When deploying to production:

1. Update the authorized redirect URIs in Google Cloud Console to include your production domain
2. Update your environment variables with production Supabase credentials
3. Ensure your domain is properly configured with HTTPS
4. Test the authentication flow in the production environment

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers) 