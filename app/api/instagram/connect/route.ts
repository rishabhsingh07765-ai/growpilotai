import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getCurrentUser } from '../../../../lib/auth';
import { metaAuthUrl } from '../../../../lib/meta';
export async function GET() {
  const u = await getCurrentUser();
  if (!u) return NextResponse.redirect(new URL('/login', process.env.APP_URL || 'http://localhost:3000'));
  if (!process.env.META_APP_ID || !process.env.META_APP_SECRET || !process.env.META_REDIRECT_URI) return NextResponse.json({ error: 'Meta integration is not configured. Add the Instagram OAuth environment variables.' }, { status: 503 });
  const state = crypto.randomBytes(24).toString('hex');
  (await cookies()).set('gp_ig_oauth_state', `${u.id}:${state}`, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 600, path: '/' });
  return NextResponse.redirect(metaAuthUrl(state));
}
