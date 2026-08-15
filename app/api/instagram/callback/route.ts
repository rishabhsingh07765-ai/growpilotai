import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '../../../../lib/db';
import { encrypt } from '../../../../lib/crypto';
import { exchangeCode, exchangeLongLivedToken, getInstagramProfile } from '../../../../lib/meta';

export async function GET(req: Request) {
  const url = new URL(req.url); const code = url.searchParams.get('code'); const state = url.searchParams.get('state');
  const jar = await cookies(); const stored = jar.get('gp_ig_oauth_state')?.value;
  const base = process.env.APP_URL || url.origin;
  if (!code || !state || !stored) return NextResponse.redirect(new URL('/instagram?error=missing_callback', base));
  const [userId, expectedState] = stored.split(':');
  jar.delete('gp_ig_oauth_state');
  if (!userId || expectedState !== state) return NextResponse.redirect(new URL('/instagram?error=invalid_oauth_state', base));
  try {
    const short = await exchangeCode(code);
    const long = await exchangeLongLivedToken(short.access_token);
    const profile = await getInstagramProfile(long.access_token);
    const igUserId = String(profile.user_id || short.user_id);
    await db.instagramAccount.upsert({
      where: { userId_igUserId: { userId, igUserId } },
      update: { username: profile.username, profileImageUrl: profile.profile_picture_url, accessTokenEncrypted: encrypt(long.access_token), connectionStatus: 'connected', tokenExpiresAt: new Date(Date.now() + long.expires_in * 1000), lastSyncAt: new Date() },
      create: { userId, igUserId, username: profile.username, profileImageUrl: profile.profile_picture_url, accessTokenEncrypted: encrypt(long.access_token), connectionStatus: 'connected', tokenExpiresAt: new Date(Date.now() + long.expires_in * 1000), lastSyncAt: new Date() },
    });
    await db.auditLog.create({ data: { userId, action: 'INSTAGRAM_CONNECTED', details: { igUserId, username: profile.username } } });
    return NextResponse.redirect(new URL('/instagram?connected=1', base));
  } catch (e: any) {
    return NextResponse.redirect(new URL(`/instagram?error=${encodeURIComponent(e?.message || 'Connection failed')}`, base));
  }
}
