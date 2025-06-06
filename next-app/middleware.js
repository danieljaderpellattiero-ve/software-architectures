import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/login', '/register', '/test-loading'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  console.log('Middleware executing for path:', pathname);
  console.log('Token found:', !!token);
  if (token) {
    console.log('Token value:', token.substring(0, 10) + '...');
  }

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  console.log('Is public path:', isPublicPath);

  // Helper to decode token safely
  async function decodeToken(token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      console.log('Token decoded successfully:', payload);
      return payload;
    } catch (err) {
      console.log('Token verification failed:', err.message);
      return null;
    }
  }

  // Handle public paths
  if (isPublicPath) {
    // If authenticated and trying to access a public path, redirect to appropriate dashboard
    if (token) {
      const decoded = await decodeToken(token);
      if (decoded) {
        const redirectPath = `/${decoded.role}Dashboard`;
        console.log('Authenticated user on public path, redirecting to:', redirectPath);
        return NextResponse.redirect(new URL(redirectPath, request.url));
      } else {
        // If token is invalid on a public path, clear it
        console.log('Invalid token on public path, clearing cookie');
        const response = NextResponse.next();
        response.cookies.set({ name: 'token', value: '', httpOnly: true, expires: new Date(0), path: '/' });
        return response;
      }
    }
    // Allow access to public paths if not authenticated
    return NextResponse.next();
  }

  // For protected routes: Check for token
  if (!token) {
    console.log('Middleware: No token found for protected path, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token for protected routes
  const decoded = await decodeToken(token);

  if (!decoded) {
    console.log('Middleware: Invalid token for protected path, redirecting to login and clearing token');
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set({ name: 'token', value: '', httpOnly: true, expires: new Date(0), path: '/' });
    return response;
  }

  // Authentication successful. Now handle authorization based on role and path.
  const userId = decoded.id;
  const userRole = decoded.role;

  console.log('Middleware: Authenticated user:', { userId, userRole });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('userId', userId); // Set userId header for authenticated requests

  // Authorization checks:
  // Allow access to /adminDashboard and its nested routes/API routes for users with 'admin' role
  if (userRole === 'admin' && (pathname.startsWith('/adminDashboard') || pathname.startsWith('/api/adminDashboard'))) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Allow access to /patientDashboard and its nested routes/API routes for users with 'patient' role
  if (userRole === 'patient' && (pathname.startsWith('/patientDashboard') || pathname.startsWith('/api/patientDashboard'))) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Allow access to /doctorDashboard and its nested routes/API routes for users with 'doctor' role
  if (userRole === 'doctor' && (pathname.startsWith('/doctorDashboard') || pathname.startsWith('/api/doctorDashboard'))) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // If authenticated but trying to access a path not allowed for their role, redirect to their dashboard
  if (!pathname.startsWith('/api')) {
    const expectedPath = `/${userRole}Dashboard`;
    if (!pathname.startsWith(expectedPath)) {
      console.log(`Middleware: User with role ${userRole} trying to access unauthorized path ${pathname}, redirecting to ${expectedPath}`);
      return NextResponse.redirect(new URL(expectedPath, request.url));
    }
  }

  // Allow access to other API routes if authenticated
  if (pathname.startsWith('/api')) {
    console.log(`Middleware: Authenticated user with role ${userRole} accessing API route ${pathname}. UserId header set.`);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // If none of the above conditions are met
  console.warn(`Middleware: Fallback - Authenticated user with role ${userRole} accessing path ${pathname}. No specific rule matched.`);
  const fallbackRedirectPath = `/${userRole}Dashboard`;
  return NextResponse.redirect(new URL(fallbackRedirectPath, request.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/patientDashboard/:path*',
    '/api/adminDashboard/:path*',
    '/api/doctorDashboard/:path*',
    '/api/auth/me',
    '/api/patient/:path*',
    '/api/patientrequests',
  ],
};