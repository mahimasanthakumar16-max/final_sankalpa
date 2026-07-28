import { NextResponse } from 'next/server';
import { forwardToAppsScript } from '@/lib/appsScript';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email } = data;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Forward to Google Apps Script (Google Sheets & email automation)
    const success = await forwardToAppsScript('newsletter', {
      email
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
