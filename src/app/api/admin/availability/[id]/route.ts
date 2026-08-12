import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return false;
  return verifyToken(token) !== null;
}

function validatePayload(body: any): { ok: boolean; error?: string } {
  if (body.startTime && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(body.startTime)) {
    return { ok: false, error: 'startTime must be HH:MM 24h format' };
  }
  if (body.endTime && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(body.endTime)) {
    return { ok: false, error: 'endTime must be HH:MM 24h format' };
  }
  if (body.startTime && body.endTime) {
    const [sH, sM] = body.startTime.split(':').map(Number);
    const [eH, eM] = body.endTime.split(':').map(Number);
    if (sH * 60 + sM >= eH * 60 + eM) {
      return { ok: false, error: 'startTime must be strictly before endTime' };
    }
  }
  if (body.type !== undefined && !['RECURRING', 'SPECIFIC_DATE'].includes(body.type)) {
    return { ok: false, error: 'type must be RECURRING or SPECIFIC_DATE' };
  }
  if (body.type === 'RECURRING' && (body.dayOfWeek === undefined || body.dayOfWeek === null)) {
    return { ok: false, error: 'dayOfWeek required for RECURRING type' };
  }
  return { ok: true };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const av = await prisma.availability.findUnique({ where: { id } });
    if (!av) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ availability: av });
  } catch (error: any) {
    console.error('Availability get error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.availability.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Availability not found' }, { status: 404 });

    const validation = validatePayload(body);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const data: any = {};
    if (body.type !== undefined) data.type = body.type;
    if (body.startTime !== undefined) data.startTime = body.startTime;
    if (body.endTime !== undefined) data.endTime = body.endTime;
    if (body.isAvailable !== undefined) data.isAvailable = !!body.isAvailable;
    if (body.note !== undefined) data.note = body.note || null;

    const finalType = data.type || existing.type;
    if (finalType === 'RECURRING') {
      data.dayOfWeek = body.dayOfWeek !== undefined ? body.dayOfWeek : existing.dayOfWeek;
      data.date = null;
    } else if (finalType === 'SPECIFIC_DATE') {
      if (body.date) {
        const [y, m, d] = body.date.split('-').map(Number);
        data.date = new Date(Date.UTC(y, m - 1, d));
      }
      data.dayOfWeek = null;
    }

    const updated = await prisma.availability.update({ where: { id }, data });
    return NextResponse.json({ success: true, availability: updated });
  } catch (error: any) {
    console.error('Availability update error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.availability.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Availability not found' }, { status: 404 });

    await prisma.availability.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Availability delete error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
