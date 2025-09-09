import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar si el usuario está autenticado
  // Por ahora usamos una verificación simple, después se integrará con Supabase
  const isAuthenticated = request.cookies.get('sb-access-token') || 
                         request.cookies.get('supabase-auth-token')

  // Rutas que requieren autenticación
  const protectedRoutes = ['/app', '/profile', '/notifications', '/admin']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Rutas públicas (landing page y auth)
  const publicRoutes = ['/', '/login', '/register', '/marketing']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Si está autenticado y va a la landing page, redirigir a la app
  if (isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/app', request.url))
  }

  // Si no está autenticado y va a rutas protegidas, redirigir a login
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si está autenticado y va a login/register, redirigir a la app
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/app', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
