import { NextResponse } from 'next/server';
import { signToken, hashPassword, comparePassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // --- Primary path: env-var credentials (always works, no DB required) ---
    if (adminEmail && adminPassword) {
      if (email === adminEmail && password === adminPassword) {
        const token = signToken({ id: 'env-admin', email, name: 'Admin' });

        const response = NextResponse.json({
          success: true,
          admin: { id: 'env-admin', email, name: 'Admin' },
        });

        response.cookies.set('admin_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24,
          path: '/',
        });

        return response;
      }
    }

    // --- Fallback path: look up admin in Prisma DB ---
    try {
      const { prisma } = await import('@/lib/prisma');

      let admin = await prisma.admin.findUnique({ where: { email } });

      if (!admin) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const isValid = await comparePassword(password, admin.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const token = signToken({ id: admin.id, email: admin.email, name: admin.name });

      const response = NextResponse.json({
        success: true,
        admin: { id: admin.id, email: admin.email, name: admin.name },
      });

      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return response;
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
