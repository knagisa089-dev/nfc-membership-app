import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set('tenant_id', '', {
    httpOnly: true,
    secure: true,
    maxAge: 0,
    path: '/',
  })
  return response
}