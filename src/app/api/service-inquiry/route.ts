import { NextResponse } from 'next/server';
import { forwardToAppsScript } from '@/lib/appsScript';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { fullName, age, mobile, email, city, service, concern, contactMethod, preferredTime, notes } = data;

    if (!fullName || !age || !mobile || !email || !city || !service || !concern || !contactMethod || !preferredTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Forward to Google Apps Script (Google Sheets & email automation)
    const success = await forwardToAppsScript('service_inquiry', {
      fullName,
      age: Number(age),
      mobile,
      email,
      city,
      service,
      concern,
      contactMethod,
      preferredTime,
      notes: notes || ''
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Service inquiry submit error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
