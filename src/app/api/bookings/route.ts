import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { forwardToAppsScript } from '@/lib/appsScript';
import {
  computeDayAvailability,
  isPastDate,
  isNowPastSlot,
} from '@/lib/availability';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { clientName, email, phone, sessionType, preferredDate, preferredTime, message } = data;

    if (!clientName || !email || !phone || !sessionType || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
    }

    if (isPastDate(preferredDate)) {
      return NextResponse.json({ error: 'Cannot book a past date.' }, { status: 400 });
    }

    if (isNowPastSlot(preferredDate, preferredTime)) {
      return NextResponse.json({ error: 'This time slot has already passed today.' }, { status: 400 });
    }

    const day = await computeDayAvailability(preferredDate);
    const norm = preferredTime.toUpperCase().trim();
    const matching = day.slots.find(s => s.time.toUpperCase() === norm);

    if (!matching) {
      return NextResponse.json(
        { error: 'The selected time is not in the available schedule.' },
        { status: 400 }
      );
    }
    if (!matching.available) {
      const reason = matching.reason;
      let msg = 'This time slot is not available.';
      if (reason === 'booked') msg = 'Sorry, this time slot has already been booked. Please choose another time.';
      if (reason === 'blocked') msg = 'This time slot is currently blocked. Please choose another time.';
      if (reason === 'past') msg = 'This time slot has already passed.';
      return NextResponse.json({ error: msg }, { status: 409 });
    }

    const existing = await prisma.booking.findFirst({
      where: {
        preferredDate,
        preferredTime: { equals: preferredTime, mode: 'insensitive' },
        status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] },
      },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Sorry, this time slot has already been booked. Please choose another time.' },
        { status: 409 }
      );
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
