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

  const logs = await prisma.scanLog.findMany({
    where: {
      nfcUid: {
        in: await prisma.nfcTag.findMany({
          where: { customer: { tenantId } },
          select: { uid: true },
        }).then(tags => tags.map(t => t.uid))
      }
    },
    orderBy: { scannedAt: 'desc' },
    take: 100,
  })

  // UID → 顧客名のマップ
  const tags = await prisma.nfcTag.findMany({
    where: { customer: { tenantId } },
    include: { customer: true },
  })
  const uidToName: Record<string, string> = {}
  tags.forEach(t => { uidToName[t.uid] = t.customer.name })

  return NextResponse.json(logs.map(l => ({
    ...l,
    customerName: uidToName[l.nfcUid] ?? '不明',
  })))
}