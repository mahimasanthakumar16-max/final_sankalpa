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

export async function GET(request: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || '';
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';

    const where: any = {};
    if (type) where.type = type;

    if (from || to) {
      where.OR = [
        { type: 'RECURRING' },
        {
          type: 'SPECIFIC_DATE',
          ...(from || to ? { date: {} } : {}),
        } as any,
      ];
      if (from) where.OR[1].date.gte = new Date(`${from}T00:00:00.000Z`);
      if (to) where.OR[1].date.lte = new Date(`${to}T23:59:59.999Z`);
    }

    const availabilities = await prisma.availability.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { dayOfWeek: 'asc' },
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return NextResponse.json({ availabilities }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Availability list error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function validatePayload(body: any): { ok: boolean; error?: string } {
  if (!body.type) return { ok: false, error: 'type is required (RECURRING or SPECIFIC_DATE)' };
  if (!['RECURRING', 'SPECIFIC_DATE'].includes(body.type)) {
    return { ok: false, error: 'type must be RECURRING or SPECIFIC_DATE' };
  }
  if (body.type === 'RECURRING') {
    if (body.dayOfWeek === undefined || body.dayOfWeek === null) {
      return { ok: false, error: 'dayOfWeek required for RECURRING (0=Sun..6=Sat)' };
    }
    if (typeof body.dayOfWeek !== 'number' || body.dayOfWeek < 0 || body.dayOfWeek > 6) {
      return { ok: false, error: 'dayOfWeek must be integer 0..6' };
    }
  }
  if (body.type === 'SPECIFIC_DATE') {
    if (!body.date) return { ok: false, error: 'date required for SPECIFIC_DATE (YYYY-MM-DD)' };
  }
  if (!body.startTime || !body.endTime) {
    return { ok: false, error: 'startTime and endTime required (HH:MM 24h)' };
  }
  const hhmm = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!hhmm.test(body.startTime) || !hhmm.test(body.endTime)) {
    return { ok: false, error: 'startTime/endTime must be HH:MM 24h format' };
  }
  const [sH, sM] = body.startTime.split(':').map(Number);
  const [eH, eM] = body.endTime.split(':').map(Number);
  if (sH * 60 + sM >= eH * 60 + eM) {
    return { ok: false, error: 'startTime must be strictly before endTime' };
  }
  if (body.isAvailable === undefined || body.isAvailable === null) {
    return { ok: false, error: 'isAvailable (boolean) is required' };
  }
  return { ok: true };
}

export async function POST(request: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = validatePayload(body);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const data: any = {
      type: body.type,
      startTime: body.startTime,
      endTime: body.endTime,
      isAvailable: !!body.isAvailable,
      note: body.note || null,
    };

    if (body.type === 'RECURRING') {
      data.dayOfWeek = body.dayOfWeek;
      data.date = null;
    } else {
      const [y, m, d] = body.date.split('-').map(Number);
      data.date = new Date(Date.UTC(y, m - 1, d));
      data.dayOfWeek = null;
    }

    const av = await prisma.availability.create({ data });
    return NextResponse.json({ success: true, availability: av });
  } catch (error: any) {
    console.error('Availability create error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
