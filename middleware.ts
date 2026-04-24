import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PASSWORD = 'cafeplage0809'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/scan')) return NextResponse.next()
  if (pathname.startsWith('/api/scan')) return NextResponse.next()
  if (pathname.startsWith('/login')) return NextResponse.next()
  if (pathname.startsWith('/api/login')) return NextResponse.next()

  const auth = request.cookies.get('auth')
  if (auth?.value === PASSWORD) return NextResponse.next()

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon-|sw.js|workbox-).*)'],
}