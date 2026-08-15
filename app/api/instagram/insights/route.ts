import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { db } from '../../../../lib/db';
import { decrypt } from '../../../../lib/crypto';
import { getInstagramInsights } from '../../../../lib/meta';
export async function GET() {
  const u = await getCurrentUser(); if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const account = await db.instagramAccount.findFirst({ where: { userId: u.id, connectionStatus: 'connected', accessTokenEncrypted: { not: null } } });
  if (!account?.accessTokenEncrypted) return NextResponse.json({ error: 'Instagram is not connected.' }, { status: 400 });
  try { const data = await getInstagramInsights(decrypt(account.accessTokenEncrypted), account.igUserId); await db.instagramAccount.update({ where: { id: account.id }, data: { lastSyncAt: new Date() } }); return NextResponse.json(data); }
  catch (e:any) { return NextResponse.json({ error: e?.message || 'Insights unavailable' }, { status: 502 }); }
}
