import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

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
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const blogs = await prisma.blog.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { excerpt: { contains: search, mode: 'insensitive' } },
            ]
          } : {},
          status ? { status: status as any } : {}
        ]
      },
      orderBy: { publishedAt: 'desc' }
    });

    return NextResponse.json({ blogs });
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
    const { title, excerpt, content, author, featured, mainImage, categories, tags, status, seoTitle, metaDescription } = data;

    if (!title || !excerpt || !content) {
      return NextResponse.json({ error: 'Title, excerpt, and content are required' }, { status: 400 });
    }

    // Auto-generate slug
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let count = 1;
    while (await prisma.blog.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const plainTextContent = stripHtml(content);
    const readingTime = Math.max(1, Math.round(plainTextContent.split(/\s+/).length / 200));

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        author: author || 'Mahima Tirunelveli Santhakumar',
        readingTime,
        featured: !!featured,
        mainImage: mainImage || null,
        categories: categories || [],
        tags: tags || [],
        status: status || 'DRAFT',
        seoTitle: seoTitle || title,
        metaDescription: metaDescription || excerpt.substring(0, 160),
      }
    });

    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
