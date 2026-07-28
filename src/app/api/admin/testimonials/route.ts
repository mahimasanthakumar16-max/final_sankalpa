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

export async function GET() {
  // Allow public access to GET testimonials
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    return NextResponse.json({ testimonials });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { clientName, review, rating, location, displayOrder, enabled } = data;

    if (!clientName || !review) {
      return NextResponse.json({ error: 'Client name and review are required' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        review,
        rating: rating !== undefined ? parseFloat(rating) : 5.0,
        location: location || null,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
        enabled: enabled !== undefined ? !!enabled : true,
      }
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { id, clientName, review, rating, location, displayOrder, enabled } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        clientName,
        review,
        rating: rating !== undefined ? parseFloat(rating) : undefined,
        location,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined,
        enabled: enabled !== undefined ? !!enabled : undefined,
      }
    });

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.testimonial.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
