const version = process.env.META_GRAPH_VERSION || 'v23.0';
const graphBase = () => `https://graph.instagram.com/${version}`;
const oauthBase = 'https://api.instagram.com';

export function metaAuthUrl(state: string) {
  const p = new URLSearchParams({
    client_id: process.env.META_APP_ID || '',
    redirect_uri: process.env.META_REDIRECT_URI || '',
    response_type: 'code',
    scope: ['instagram_business_basic', 'instagram_business_content_publish', 'instagram_business_manage_insights'].join(','),
    state,
  });
  return `https://www.instagram.com/oauth/authorize?${p}`;
}

export async function exchangeCode(code: string) {
  const body = new URLSearchParams({
    client_id: process.env.META_APP_ID || '',
    client_secret: process.env.META_APP_SECRET || '',
    grant_type: 'authorization_code',
    redirect_uri: process.env.META_REDIRECT_URI || '',
    code,
  });
  const r = await fetch(`${oauthBase}/oauth/access_token`, { method: 'POST', body, cache: 'no-store' });
  if (!r.ok) throw new Error(`Instagram token exchange failed (${r.status})`);
  return r.json() as Promise<{ access_token: string; user_id: string }>;
}

export async function exchangeLongLivedToken(shortToken: string) {
  const u = new URL(`${graphBase()}/access_token`);
  u.searchParams.set('grant_type', 'ig_exchange_token');
  u.searchParams.set('client_secret', process.env.META_APP_SECRET || '');
  u.searchParams.set('access_token', shortToken);
  const r = await fetch(u, { cache: 'no-store' });
  if (!r.ok) throw new Error(`Instagram long-lived token exchange failed (${r.status})`);
  return r.json() as Promise<{ access_token: string; token_type: string; expires_in: number }>;
}

export async function refreshLongLivedToken(token: string) {
  const u = new URL(`${graphBase()}/refresh_access_token`);
  u.searchParams.set('grant_type', 'ig_refresh_token');
  u.searchParams.set('access_token', token);
  const r = await fetch(u, { cache: 'no-store' });
  if (!r.ok) throw new Error(`Instagram token refresh failed (${r.status})`);
  return r.json() as Promise<{ access_token: string; token_type: string; expires_in: number }>;
}

async function igGet(path: string, token: string) {
  const r = await fetch(`${graphBase()}${path}${path.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(token)}`, { cache: 'no-store' });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || `Instagram API error (${r.status})`);
  return data;
}

export async function getInstagramProfile(token: string) {
  return igGet('/me?fields=user_id,username,name,profile_picture_url', token);
}

export async function getInstagramInsights(token: string, igUserId: string) {
  return igGet(`/${igUserId}/insights?metric=reach,profile_views&period=day`, token);
}

export async function publishImage(igUserId: string, token: string, imageUrl: string, caption: string) {
  const c = await fetch(`${graphBase()}/${igUserId}/media`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ image_url: imageUrl, caption, access_token: token }),
    cache: 'no-store',
  });
  const cj = await c.json();
  if (!c.ok) throw new Error(cj?.error?.message || `Media creation failed (${c.status})`);

  const p = await fetch(`${graphBase()}/${igUserId}/media_publish`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ creation_id: cj.id, access_token: token }),
    cache: 'no-store',
  });
  const pj = await p.json();
  if (!p.ok) throw new Error(pj?.error?.message || `Media publish failed (${p.status})`);
  return pj as { id: string };
}
