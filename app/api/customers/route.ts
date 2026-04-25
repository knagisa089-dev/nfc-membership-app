import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

const PLAN_LIMITS = {
  FREE: 30,
  STANDARD: 200,
  PRO: Infinity,
}

export async function GET() {
  const cookieStore = await cookies()
  const tenantId = cookieStore.get('tenant_id')?.value

  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const customers = await prisma.customer.findMany({
    where: { tenantId },
    include: {
      subscription: true,
      nfcTag: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(customers)
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const tenantId = cookieStore.get('tenant_id')?.value

  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
  }

  const limit = PLAN_LIMITS[tenant.plan]
  const count = await prisma.customer.count({ where: { tenantId } })

  if (count >= limit) {
    return NextResponse.json({
      error: `現在のプラン（${tenant.plan === 'FREE' ? 'フリー' : tenant.plan === 'STANDARD' ? 'スタンダード' : 'プロ'}）では${limit}人までしか登録できません。プランをアップグレードしてください。`
    }, { status: 403 })
  }

  const body = await request.json()
  const customer = await prisma.customer.create({
    data: {
      tenantId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      note: body.note,
    },
  })

  return NextResponse.json(customer)
}