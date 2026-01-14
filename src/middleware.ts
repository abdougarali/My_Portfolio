import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public routes
        if (
          pathname === '/admin/login' ||
          pathname.startsWith('/api/auth') ||
          (pathname.startsWith('/api/projects') && req.method === 'GET') ||
          pathname === '/api/contact' ||
          (pathname === '/api/settings' && req.method === 'GET')
        ) {
          return true;
        }

        // Protect admin routes
        if (pathname.startsWith('/admin')) {
          return !!token;
        }

        // Protect admin API routes
        if (pathname.startsWith('/api/admin')) {
          return !!token;
        }

        // Protect write operations on projects API
        if (
          pathname.startsWith('/api/projects') &&
          ['POST', 'PUT', 'DELETE'].includes(req.method || '')
        ) {
          return !!token;
        }

        // Protect upload API
        if (pathname.startsWith('/api/upload')) {
          return !!token;
        }

        // Protect settings write operations
        if (pathname === '/api/settings' && req.method === 'PUT') {
          return !!token;
        }

        // Allow all other routes
        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/projects/:path*',
    '/api/upload/:path*',
    '/api/settings',
  ],
};
