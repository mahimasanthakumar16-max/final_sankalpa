import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { forwardToAppsScript } from '@/lib/appsScript';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, subject, service, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        service: service || null,
        message,
        isRead: false,
      }
    });

    // Forward to Google Apps Script (Google Sheets & email automation)
    await forwardToAppsScript('contact', {
      name,
      email,
      phone: phone || '',
      subject: subject || '',
      service: service || '',
      message
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Contact submit error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
