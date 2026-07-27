// src/app/api/admin/blogs/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth';

/** Helper to extract bucket and path from a public Supabase URL */
function parseSupabasePublicUrl(url: string): { bucket: string; path: string } | null {
  try {
    const publicSegment = '/storage/v1/object/public/';
    const idx = url.indexOf(publicSegment);
    if (idx === -1) return null;
    const after = url.substring(idx + publicSegment.length); // "bucket/path"
    const parts = after.split('/');
    const bucket = parts.shift();
    const path = parts.join('/');
    if (!bucket || !path) return null;
    return { bucket, path };
  } catch {
    return null;
  }
}

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return false;
  return verifyToken(token) !== null;
}

/** UPDATE a blog post */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const {
      title,
      excerpt,
      content,
      author,
      featured,
      mainImage,
      categories,
      tags,
      status,
      seoTitle,
      metaDescription,
    } = data;

    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Delete old image if a new image URL is provided and differs, or if image is cleared
    if (mainImage !== undefined && mainImage !== existing.mainImage && existing.mainImage) {
      const parsed = parseSupabasePublicUrl(existing.mainImage);
      if (parsed) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.JWT_SECRET!
        );
        const { error } = await supabase.storage.from(parsed.bucket).remove([parsed.path]);
        if (error) console.warn('Failed to delete old image from Supabase:', error.message);
      }
    }

    // Re‑calculate reading time only when content changes
    const readingTime = content
      ? Math.max(1, Math.round(content.split(/\\s+/).length / 200))
      : existing.readingTime;

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        content: content !== undefined ? content : existing.content,
        author: author !== undefined ? author : existing.author,
        readingTime,
        featured: featured !== undefined ? !!featured : existing.featured,
        mainImage: mainImage !== undefined ? mainImage : existing.mainImage,
        categories: categories !== undefined ? categories : existing.categories,
        tags: tags !== undefined ? tags : existing.tags,
        status: status !== undefined ? status : existing.status,
        seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
        metaDescription:
          metaDescription !== undefined ? metaDescription : existing.metaDescription,
      },
    });

    return NextResponse.json({ success: true, blog: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** DELETE a blog post and its image */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    // Retrieve the blog to know the image URL before deletion
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (blog?.mainImage) {
      const parsed = parseSupabasePublicUrl(blog.mainImage);
      if (parsed) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.JWT_SECRET!
        );
        const { error } = await supabase.storage.from(parsed.bucket).remove([parsed.path]);
        if (error) console.warn('Failed to delete image from Supabase during blog removal:', error.message);
      }
    }

    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
