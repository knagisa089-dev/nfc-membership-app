import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const uid = searchParams.get('uid')
  const tenantId = searchParams.get('tid')

  if (!uid) {
    return NextResponse.json({ result: 'NOT_FOUND' }, { status: 400 })
  }

  const tag = await prisma.nfcTag.findUnique({
    where: { uid },
    include: {
      customer: {
        include: { subscription: true }
      }
    }
  })

  if (!tag || (tenantId && tag.customer.tenantId !== tenantId)) {
    await prisma.scanLog.create({
      data: { nfcUid: uid, result: 'NOT_FOUND' }
    })
    return NextResponse.json({ result: 'NOT_FOUND' })
  }

  const subscription = tag.customer.subscription
  const now = new Date()
  let status = 'NOT_FOUND'

  if (subscription) {
    const expiresAt = new Date(subscription.expiresAt)
    if (subscription.status === 'SUSPENDED') {
      status = 'SUSPENDED'
    } else if (expiresAt > now) {
      status = 'ACTIVE'
      if (subscription.status !== 'ACTIVE') {
        await prisma.subscription.update({
          where: { customerId: tag.customerId },
          data: { status: 'ACTIVE' },
        })
      }
    } else {
      status = 'EXPIRED'
      if (subscription.status !== 'EXPIRED') {
        await prisma.subscription.update({
          where: { customerId: tag.customerId },
          data: { status: 'EXPIRED' },
        })
      }
    }
  }

  await prisma.scanLog.create({
    data: { nfcUid: uid, result: status }
  })

  return NextResponse.json({
    result: status,
    customer: {
      name: tag.customer.name,
      email: tag.customer.email,
      phone: tag.customer.phone,
      address: tag.customer.address,
      birthday: tag.customer.birthday,
      note: tag.customer.note,
      expiresAt: subscription?.expiresAt,
    }
  })
}