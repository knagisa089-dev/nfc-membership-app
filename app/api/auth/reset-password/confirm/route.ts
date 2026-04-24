import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const body = await request.json()
  const { token, password } = body

  if (!token || !password) {
    return NextResponse.json({ error: 'トークンとパスワードは必須です' }, { status: 400 })
  }

  const tenant = await prisma.tenant.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: { gt: new Date() },
    },
  })

  if (!tenant) {
    return NextResponse.json({ error: 'リンクが無効または期限切れです' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpires: null,
    },
  })

  return NextResponse.json({ ok: true })
}