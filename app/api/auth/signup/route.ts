import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password, shopName } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'メールとパスワードは必須です' }, { status: 400 })
  }

  const existing = await prisma.tenant.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'このメールアドレスはすでに登録されています' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 10)
  const tenant = await prisma.tenant.create({
    data: { email, password: hashed, shopName },
  })

  const response = NextResponse.json({ ok: true })
  response.cookies.set('tenant_id', tenant.id, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return response
}