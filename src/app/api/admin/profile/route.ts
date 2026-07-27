import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken, hashPassword } from '@/lib/auth';

async function getAuthenticatedAdminId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload ? payload.id : null;
}

export async function PUT(request: Request) {
  const adminId = await getAuthenticatedAdminId();
  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { name, email, newPassword } = data;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) {
      // Check email uniqueness
      const existing = await prisma.admin.findUnique({ where: { email } });
      if (existing && existing.id !== adminId) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
      updateData.email = email;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updated = await prisma.admin.update({
      where: { id: adminId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      admin: { id: updated.id, email: updated.email, name: updated.name }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
