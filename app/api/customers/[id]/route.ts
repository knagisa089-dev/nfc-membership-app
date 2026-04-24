import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await request.json()
  const { id: customerId } = await params
  const cookieStore = await cookies()
  const tenantId = cookieStore.get('tenant_id')?.value

  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (body.nfcUid) {
    const existing = await prisma.nfcTag.findUnique({ where: { customerId } })
    if (existing) {
      await prisma.nfcTag.update({ where: { customerId }, data: { uid: body.nfcUid } })
    } else {
      await prisma.nfcTag.create({ data: { uid: body.nfcUid, customerId } })
    }
  }

  if (body.status || body.expiresAt) {
    const existing = await prisma.subscription.findUnique({ where: { customerId } })
    if (existing) {
      await prisma.subscription.update({
        where: { customerId },
        data: {
          status: body.status,
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : existing.expiresAt,
        },
      })
    } else {
      await prisma.subscription.create({
        data: {
          customerId,
          status: body.status ?? 'ACTIVE',
          expiresAt: new Date(body.expiresAt),
        },
      })
    }
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: { subscription: true, nfcTag: true },
  })

  return NextResponse.json(customer)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: customerId } = await params
  const cookieStore = await cookies()
  const tenantId = cookieStore.get('tenant_id')?.value

  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const customer = await prisma.customer.findUnique({ where: { id: customerId } })
  if (!customer || customer.tenantId !== tenantId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.customer.delete({ where: { id: customerId } })
  return NextResponse.json({ ok: true })
}