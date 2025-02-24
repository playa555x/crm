import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Definiere öffentliche Routen
const publicRoutes = ['/auth', '/auth/reset-password', '/auth/verify']
const apiRoutes = ['/api']

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // Überprüfe die aktuelle Route
    const path = request.nextUrl.pathname

    // Überspringe Middleware für API-Routen
    if (apiRoutes.some(route => path.startsWith(route))) {
      return res
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Erlaube Zugriff auf öffentliche Routen
    if (publicRoutes.some(route => path.startsWith(route))) {
      // Wenn Session existiert und User auf Auth-Routen zugreift,
      // leite zum Dashboard weiter
      if (session) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return res
    }

    // Wenn keine Session existiert und die Route geschützt ist,
    // leite zum Login weiter
    if (!session) {
      const redirectUrl = new URL('/auth', request.url)
      // Speichere ursprüngliche URL als Redirect-Parameter
      redirectUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    // Log error aber erlaube Request
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}