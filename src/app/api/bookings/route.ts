import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { forwardToAppsScript } from '@/lib/appsScript';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { clientName, email, phone, sessionType, preferredDate, preferredTime, message } = data;

    if (!clientName || !email || !phone || !sessionType || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        clientName,
        email,
        phone,
        sessionType,
        preferredDate,
        preferredTime,
        message: message || null,
        status: 'PENDING',
      }
    });

    // Forward to Google Apps Script (Google Sheets & email automation)
    await forwardToAppsScript('bookings', {
      clientName,
      email,
      phone,
      sessionType,
      preferredDate,
      preferredTime,
      message: message || ''
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Booking submit error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
