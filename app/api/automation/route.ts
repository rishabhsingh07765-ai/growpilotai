import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { db } from '../../../lib/db';

export async function GET() {
  const u = await getCurrentUser();
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const settings = await db.automationSettings.upsert({ where: { userId: u.id }, update: {}, create: { userId: u.id } });
  const [scheduled, drafts, published, recentLogs] = await Promise.all([
    db.scheduledPost.count({ where: { content: { userId: u.id }, status: 'scheduled' } }),
    db.content.count({ where: { userId: u.id, status: 'draft' } }),
    db.content.count({ where: { userId: u.id, status: 'published' } }),
    db.auditLog.findMany({ where: { userId: u.id }, orderBy: { createdAt: 'desc' }, take: 8 }),
  ]);
  return NextResponse.json({ settings, stats: { scheduled, drafts, published }, logs: recentLogs });
}

export async function PATCH(req: Request) {
  const u = await getCurrentUser();
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const d = await req.json();
  const settings = await db.automationSettings.upsert({
    where: { userId: u.id },
    update: {
      enabled: !!d.enabled,
      mode: ['manual','assisted','autopilot'].includes(d.mode) ? d.mode : 'assisted',
      postsPerWeek: Math.max(1, Math.min(14, Number(d.postsPerWeek || 3))),
      autoApproveEducational: !!d.autoApproveEducational,
      autoApprovePromotional: !!d.autoApprovePromotional,
      requireApprovalSensitive: d.requireApprovalSensitive !== false,
    },
    create: { userId: u.id },
  });
  await db.auditLog.create({ data: { userId: u.id, action: settings.enabled ? 'AUTOPILOT_ENABLED' : 'AUTOPILOT_UPDATED', details: settings } });
  return NextResponse.json({ settings });
}
