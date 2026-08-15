import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { db } from '../../../../lib/db';
export async function POST() {
  const u = await getCurrentUser();
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const steps = ['Analyze account', 'Generate strategy', 'Create content', 'Validate content', 'Schedule', 'Publish (simulation)'];
  await db.auditLog.create({ data: { userId: u.id, action: 'AUTOMATION_TEST', details: { steps, mode: 'simulation' } } });
  return NextResponse.json({ ok: true, steps: steps.map(name => ({ name, status: 'simulated' })) });
}
