// src/app/api/admin/blogs/upload/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && verifyToken(token) !== null;
}

export async function POST(request: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate mime type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
  }

  // Validate size (5 MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'Image exceeds 5 MB' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.JWT_SECRET!
  );

  const bucket = 'blog-images';
  // Ensure bucket exists (idempotent)
  await supabase.storage.createBucket(bucket, { public: true }).catch(() => {});

  const now = new Date();
  const year = now.getUTCFullYear().toString();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const unique = `${Date.now()}-${crypto.randomUUID()}`;
  const filePath = `${year}/${month}/${unique}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: false, contentType: file.type });

  if (error) {
    console.error('Supabase upload error', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeURIComponent(filePath)}`;

  return NextResponse.json({ url: publicUrl });
}
