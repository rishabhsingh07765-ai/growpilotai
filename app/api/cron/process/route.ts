import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { decrypt, encrypt } from '../../../../lib/crypto';
import { publishImage, refreshLongLivedToken } from '../../../../lib/meta';

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const now = new Date();
  const jobs = await db.scheduledPost.findMany({ where: { status: 'scheduled', scheduledAt: { lte: now }, content: { status: 'scheduled' } }, include: { content: true, instagramAccount: true }, take: 10 });
  const results = [];
  for (const job of jobs) {
    if (job.instagramAccount.accessTokenEncrypted && job.instagramAccount.tokenExpiresAt && job.instagramAccount.tokenExpiresAt.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000) {
      try {
        const refreshed = await refreshLongLivedToken(decrypt(job.instagramAccount.accessTokenEncrypted));
        const encrypted = encrypt(refreshed.access_token);
        await db.instagramAccount.update({ where: { id: job.instagramAccount.id }, data: { accessTokenEncrypted: encrypted, tokenExpiresAt: new Date(Date.now() + refreshed.expires_in * 1000) } });
        job.instagramAccount.accessTokenEncrypted = encrypted;
      } catch { /* keep the existing token; publishing will report a useful error if it is invalid */ }
    }
    if (!job.instagramAccount.accessTokenEncrypted || !job.content.mediaUrls[0]) {
      await db.scheduledPost.update({ where: { id: job.id }, data: { status: 'failed', errorMessage: 'Missing connected account token or public media URL.' } });
      await db.content.update({ where: { id: job.contentId }, data: { status: 'failed' } }); results.push({ id: job.id, status: 'failed' }); continue;
    }
    await db.scheduledPost.update({ where: { id: job.id }, data: { status: 'publishing', attemptCount: { increment: 1 } } });
    try {
      if (job.content.type !== 'image') throw new Error('Automatic publisher currently supports image posts only.');
      const result = await publishImage(job.instagramAccount.igUserId, decrypt(job.instagramAccount.accessTokenEncrypted), job.content.mediaUrls[0], job.content.caption || '');
      await db.scheduledPost.update({ where: { id: job.id }, data: { status: 'published', publishedAt: new Date(), externalPostId: result.id } });
      await db.content.update({ where: { id: job.contentId }, data: { status: 'published' } });
      await db.auditLog.create({ data: { userId: job.content.userId, action: 'POST_PUBLISHED', details: { scheduledPostId: job.id, externalPostId: result.id } } });
      results.push({ id: job.id, status: 'published' });
    } catch (e: any) {
      const attempts = job.attemptCount + 1; const final = attempts >= 3;
      await db.scheduledPost.update({ where: { id: job.id }, data: { status: final ? 'failed' : 'scheduled', errorMessage: e?.message || 'Publish failed' } });
      if (final) await db.content.update({ where: { id: job.contentId }, data: { status: 'failed' } });
      await db.auditLog.create({ data: { userId: job.content.userId, action: 'POST_PUBLISH_FAILED', status: 'failed', details: { scheduledPostId: job.id, error: e?.message } } });
      results.push({ id: job.id, status: final ? 'failed' : 'retrying' });
    }
  }
  return NextResponse.json({ processed: results.length, results, at: now.toISOString() });
}
