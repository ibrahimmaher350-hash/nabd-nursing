import { NextResponse } from 'next/server';

/**
 * GET /api/auth/google
 * Initiates the Google OAuth 2.0 flow for Calendar and Sheets access.
 */
export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'GOOGLE_CLIENT_ID is not configured in environment variables' },
      { status: 500 }
    );
  }

  // Derive redirect URI dynamically or from env
  const requestUrl = new URL(request.url);
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    `${requestUrl.origin}/api/auth/google/callback`;

  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/userinfo.email',
  ].join(' ');

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', scopes);
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent'); // Always request refresh_token
  googleAuthUrl.searchParams.set('state', 'nabd-clinic-oauth');

  return NextResponse.redirect(googleAuthUrl.toString());
}
