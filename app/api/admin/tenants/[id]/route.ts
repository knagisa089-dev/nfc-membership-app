import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

async function checkAdmin() {
  const cookieStore = await cookies()
  const tenantId = cookieStore.get('tenant_id')?.value
  if (!tenantId) return null
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
  if (!tenant?.isAdmin) return null
  return tenant
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin()
  if (!admin) {
    return NextResponse.json({ error: '管理者のみアクセスできます' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  const tenant = await prisma.tenant.update({
    where: { id },
    data: { plan: body.plan },
  })

  return NextResponse.json(tenant)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin()
  if (!admin) {
    return NextResponse.json({ error: '管理者のみアクセスできます' }, { status: 403 })
  }

  const { id } = await params

  // 自分自身は削除不可
  if (id === admin.id) {
    return NextResponse.json({ error: '自分自身は削除できません' }, { status: 400 })
  }

  await prisma.tenant.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}