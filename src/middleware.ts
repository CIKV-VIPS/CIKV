import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-default-secret');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth routes to pass through
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value || request.headers.get('Authorization')?.split(' ')[1];

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname.startsWith('/api/forms')) {
    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
      if (!token) {
        return new NextResponse(JSON.stringify({ message: 'Authorization header is missing or invalid' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      }

      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.next();
      } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Invalid or expired token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/forms/:path*', '/dashboard/:path*'],
};