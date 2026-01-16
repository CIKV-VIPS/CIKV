import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-default-secret');

// --- CORS Configuration ---
// Note: In a production app, you should limit the allowed origins.
// Using '*' is permissive but effective for debugging.
const allowedOrigins = process.env.VERCEL_URL
  ? [`https://${process.env.VERCEL_URL}`]
  : ['http://localhost:3000'];

function getCorsHeaders(origin: string | null) {
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Origin': allowedOrigins[0] // Default origin
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  
  return headers;
}


export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // --- Handle Preflight OPTIONS Requests ---
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers: corsHeaders });
  }

  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // --- Add CORS headers to all API responses ---
  if (pathname.startsWith('/api/')) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  // --- Authentication/Authorization Logic ---
  try {
    if (pathname.startsWith('/dashboard')) {
      const token = request.cookies.get('accessToken')?.value;
      if (!token) return NextResponse.redirect(new URL('/login', request.url));
      await jwtVerify(token, JWT_SECRET);
    }

    const protectedApiRoutes = ['/api/forms', '/api/blogs', '/api/events', '/api/gallery'];
    if (protectedApiRoutes.some(route => pathname.startsWith(route)) && ['POST', 'PUT', 'DELETE'].includes(request.method)) {
      const token = request.headers.get('Authorization')?.split(' ')[1];
      if (!token) {
        const headers = { ...corsHeaders, 'Content-Type': 'application/json' };
        return new NextResponse(JSON.stringify({ message: 'Authorization header is missing' }), { status: 401, headers });
      }
      await jwtVerify(token, JWT_SECRET);
    }
  } catch (error) {
    const headers = { ...corsHeaders, 'Content-Type': 'application/json' };
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return new NextResponse(JSON.stringify({ message: 'Invalid or expired token' }), { status: 401, headers });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
