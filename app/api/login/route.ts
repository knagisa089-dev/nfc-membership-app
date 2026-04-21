import { NextResponse } from 'next/server'

const PASSWORD = process.env.APP_PASSWORD ?? 'password123'

export async function POST(request: Request) {
  const body = await request.json()

  if (body.password !== PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('auth', PASSWORD, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 30, // 30日間
    path: '/',
  })

  return response
}