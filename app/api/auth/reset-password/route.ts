import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import crypto from 'crypto'

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const body = await request.json()
  const { email } = body

  if (!email) {
    return NextResponse.json({ error: 'メールアドレスは必須です' }, { status: 400 })
  }

  const tenant = await prisma.tenant.findUnique({ where: { email } })

  // セキュリティのため存在しなくても成功を返す
  if (!tenant) {
    return NextResponse.json({ ok: true })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 60) // 1時間

  await prisma.tenant.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpires: expires,
    },
  })

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: 'NFC会員管理 <onboarding@resend.dev>',
    to: email,
    subject: 'パスワードリセット',
    html: `
      <p>パスワードリセットのリクエストを受け付けました。</p>
      <p>以下のリンクをクリックしてパスワードを変更してください。</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>このリンクは1時間で無効になります。</p>
      <p>心当たりがない場合はこのメールを無視してください。</p>
    `,
  })

  return NextResponse.json({ ok: true })
}