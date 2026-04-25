import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/') return NextResponse.next()
  if (pathname.startsWith('/scan')) return NextResponse.next()
  if (pathname.startsWith('/api/scan')) return NextResponse.next()
  if (pathname.startsWith('/login')) return NextResponse.next()
  if (pathname.startsWith('/signup')) return NextResponse.next()
  if (pathname.startsWith('/api/auth')) return NextResponse.next()
  if (pathname.startsWith('/api/cron')) return NextResponse.next()
  if (pathname.startsWith('/api/stripe/webhook')) return NextResponse.next()

  const tenantId = request.cookies.get('tenant_id')
  if (tenantId?.value) return NextResponse.next()

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon-|sw.js|workbox-).*)'],
}