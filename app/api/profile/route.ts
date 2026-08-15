import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { db } from '../../../lib/db';

export async function PATCH(req: Request) {
  const u = await getCurrentUser();
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const d = await req.json();
  const b = await db.brandProfile.upsert({
    where: { userId: u.id },
    update: { name: d.name, niche: d.niche, brandVoice: d.brandVoice, language: d.language, audience: d.audience, goals: d.goals },
    create: { userId: u.id, name: d.name, niche: d.niche, brandVoice: d.brandVoice, language: d.language, audience: d.audience, goals: d.goals },
  });
  return NextResponse.json({ brandProfile: b });
}
