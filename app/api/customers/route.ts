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