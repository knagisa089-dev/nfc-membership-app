import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'メールとパスワードは必須です' }, { status: 400 })
  }

  const tenant = await prisma.tenant.findUnique({ where: { email } })
  if (!tenant) {
    return NextResponse.json({ error: 'メールアドレスまたはパスワードが違います' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, tenant.password)
  if (!valid) {
    return NextResponse.json({ error: 'メールアドレスまたはパスワードが違います' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('tenant_id', tenant.id, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return response
}