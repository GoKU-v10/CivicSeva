import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    // Check for authentication token in cookies
    const isAuthenticated = request.cookies.get('is_citizen_logged_in')?.value === 'true' ||
                           request.cookies.get('is_admin_logged_in')?.value === 'true'

    // If not authenticated via cookies, redirect to login
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Handle dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const isAuthenticated = request.cookies.get('is_citizen_logged_in')?.value === 'true'

    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*'
  ]
}
