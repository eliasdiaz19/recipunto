import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar si el usuario está autenticado usando las cookies de Supabase
  const supabaseAccessToken = request.cookies.get('sb-127.0.0.1-3000-auth-token')?.value ||
                              request.cookies.get('sb-localhost-3000-auth-token')?.value ||
                              request.cookies.get('supabase.auth.token')?.value ||
                              request.cookies.get('sb-access-token')?.value

  let isAuthenticated = false
  
  // Intentar parsear el token de Supabase para verificar autenticación
  if (supabaseAccessToken) {
    try {
      const tokenData = JSON.parse(supabaseAccessToken)
      isAuthenticated = !!(tokenData.access_token && tokenData.user)
    } catch {
      // Si no se puede parsear, verificar si existe el token básico
      isAuthenticated = !!supabaseAccessToken
    }
  }

  // Rutas que requieren autenticación estricta
  const strictProtectedRoutes = ['/admin']
  const isStrictProtectedRoute = strictProtectedRoutes.some(route => pathname.startsWith(route))

  // Rutas públicas (landing page y auth)
  const publicRoutes = ['/', '/login', '/register', '/marketing', '/map', '/profile', '/notifications', '/boxes']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Solo proteger rutas administrativas estrictamente
  if (!isAuthenticated && isStrictProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si está autenticado y va a login/register, redirigir al mapa
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/map', request.url))
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
