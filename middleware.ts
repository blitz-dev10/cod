import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get cookie that we'll set on auth
  const isAuthenticated = request.cookies.get('auth')

  // List of protected routes
  const protectedRoutes = [
    '/course',
    '/courses',
    '/htmlplayground',
    '/codingplayground',
  ]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/course/:path*',
    '/courses/:path*',
    '/htmlplayground/:path*',
    '/codingplayground/:path*',
  ]
}