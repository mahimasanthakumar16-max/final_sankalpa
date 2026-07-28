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
  // Allow public access to GET resources, or restrict if desired
  // We'll allow public GET so the frontend website can render resources, but secure mutations
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const resources = await prisma.resource.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ]
          } : {},
          category ? { category } : {}
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ resources });
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
    const { title, category, description, fileUrl, thumbnailUrl, published } = data;

    if (!title || !category || !description || !fileUrl) {
      return NextResponse.json({ error: 'Title, category, description, and file URL are required' }, { status: 400 });
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        category,
        description,
        fileUrl,
        thumbnailUrl: thumbnailUrl || null,
        published: published !== undefined ? !!published : true,
      }
    });

    return NextResponse.json({ success: true, resource });
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
    const { id, title, category, description, fileUrl, thumbnailUrl, published } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updated = await prisma.resource.update({
      where: { id },
      data: {
        title,
        category,
        description,
        fileUrl,
        thumbnailUrl,
        published: published !== undefined ? !!published : undefined,
      }
    });

    return NextResponse.json({ success: true, resource: updated });
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

    await prisma.resource.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
