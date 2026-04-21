import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PASSWORD = process.env.APP_PASSWORD ?? 'password123'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // スキャンページはパスワード不要
  if (pathname.startsWith('/scan')) {
    return NextResponse.next()
  }

  // APIのスキャンはパスワード不要
  if (pathname.startsWith('/api/scan')) {
    return NextResponse.next()
  }

  // ログインページはパスワード不要
  if (pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  // クッキーを確認
  const auth = request.cookies.get('auth')
  if (auth?.value === PASSWORD) {
    return NextResponse.next()
  }

  // ログインページにリダイレクト
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon-|sw.js|workbox-).*)'],
}