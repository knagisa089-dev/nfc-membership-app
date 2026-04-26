import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET() {
  const cookieStore = await cookies()
  const tenantId = cookieStore.get('tenant_id')?.value

  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
  if (!tenant?.isAdmin) {
    return NextResponse.json({ error: '管理者のみアクセスできます' }, { status: 403 })
  }

  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { customers: true } }
    },
    select: {
      id: true,
      email: true,
      shopName: true,
      plan: true,
      isAdmin: true,
      createdAt: true,
      _count: true,
    }
  })

  return NextResponse.json(tenants)
}