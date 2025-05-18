import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/login', '/register', '/test-loading'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  console.log('Middleware executing for path:', pathname);
  console.log('Token found:', !!token);

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  console.log('Is public path:', isPublicPath);

  // Helper to decode token safely
  async function decodeToken(token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch (err) {
      console.log('Token verification failed:', err.message);
      return null;
    }
  }

  if (isPublicPath) {
    if (token) {
      const decoded = await decodeToken(token);
      if (decoded) {
        const redirectPath = `/${decoded.role}Dashboard`;
        return NextResponse.redirect(new URL(redirectPath, request.url));
      } else {
        const response = NextResponse.next();
        response.cookies.set({ name: 'token', value: '', httpOnly: true, expires: new Date(0), path: '/' });
        return response;
      }
    }
    return NextResponse.next();
  }

  // For protected routes
  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decoded = await decodeToken(token);

  if (!decoded) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set({ name: 'token', value: '', httpOnly: true, expires: new Date(0), path: '/' });
    return response;
  }

  // Allow access to /adminDashboard and its nested routes for users with 'admin' role
  if (decoded.role === 'admin' && pathname.startsWith('/adminDashboard')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('userId', decoded.id);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Allow access to /patientDashboard and its nested routes for users with 'patient' role
  if (decoded.role === 'patient' && pathname.startsWith('/patientDashboard')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('userId', decoded.id);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Allow access to /doctorDashboard and its nested routes for users with 'doctor' role
  if (decoded.role === 'doctor' && pathname.startsWith('/doctorDashboard')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('userId', decoded.id);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const expectedPath = `/${decoded.role}Dashboard`;

  // Enforce redirection for other roles
  if (!pathname.startsWith('/api') && pathname !== expectedPath) {
    return NextResponse.redirect(new URL(expectedPath, request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('userId', decoded.id);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};