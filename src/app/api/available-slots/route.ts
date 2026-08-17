import { NextResponse } from 'next/server';
import {
  computeDayAvailability,
  computeMonthAvailability,
} from '@/lib/availability';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || '';
    const month = searchParams.get('month') || '';

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    if (month) {
      const m = /^\d{4}-\d{2}$/.test(month);
      if (!m) {
        return NextResponse.json({ error: 'month must be YYYY-MM' }, { status: 400 });
      }
      const data = await computeMonthAvailability(month);
      return NextResponse.json({ month, availability: data }, { headers });
    }

    if (date) {
      const d = /^\d{4}-\d{2}-\d{2}$/.test(date);
      if (!d) {
        return NextResponse.json({ error: 'date must be YYYY-MM-DD' }, { status: 400 });
      }
      const day = await computeDayAvailability(date);
      return NextResponse.json(day, { headers });
    }

    return NextResponse.json(
      { error: 'Either ?date=YYYY-MM-DD or ?month=YYYY-MM is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Available slots error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
