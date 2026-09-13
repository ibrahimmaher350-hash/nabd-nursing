import { NextResponse } from 'next/server';
import { encryptToken } from '@/lib/crypto';
import { supabase } from '@/lib/supabase/client';

/**
 * GET /api/auth/google/callback
 * Exchanges authorization code for Google access and refresh tokens,
 * encrypts the refresh token, and stores it in the admin profile.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  if (error || !code) {
    console.error('[Google OAuth Callback Error]', error);
    return NextResponse.redirect(new URL('/dashboard?google=error&msg=' + encodeURIComponent(error || 'No code returned'), requestUrl.origin));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    `${requestUrl.origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/dashboard?google=error&msg=MissingCredentials', requestUrl.origin));
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.refresh_token) {
      console.warn('[Google OAuth] Token response did not include refresh_token:', tokenData);
      // If user already authorized previously, Google might return only access_token unless prompt=consent was used
      if (tokenData.access_token) {
        return NextResponse.redirect(new URL('/dashboard?google=connected&note=already_authorized', requestUrl.origin));
      }
      return NextResponse.redirect(new URL('/dashboard?google=error&msg=' + encodeURIComponent(tokenData.error || 'NoRefreshToken'), requestUrl.origin));
    }

    const encryptedRefreshToken = encryptToken(tokenData.refresh_token);

    // Save encrypted refresh token in Supabase admin profile
    try {
      const { data: updated } = await supabase
        .from('profiles')
        .update({
          google_refresh_token: encryptedRefreshToken,
          role: 'admin',
          updated_at: new Date().toISOString(),
        })
        .eq('role', 'admin')
        .select();

      if (!updated || updated.length === 0) {
        const { data: anyProfiles } = await supabase.from('profiles').select('id').limit(1);
        if (anyProfiles && anyProfiles.length > 0) {
          await supabase.from('profiles').update({
            google_refresh_token: encryptedRefreshToken,
            role: 'admin',
            updated_at: new Date().toISOString(),
          }).eq('id', anyProfiles[0].id);
        }
      }
    } catch (dbErr) {
      console.error('[Supabase Profile Update Error]', dbErr);
    }

    return NextResponse.redirect(new URL('/dashboard?google=connected', requestUrl.origin));
  } catch (err: any) {
    console.error('[Google OAuth Callback Exception]', err);
    return NextResponse.redirect(new URL('/dashboard?google=error&msg=Exception', requestUrl.origin));
  }
}
