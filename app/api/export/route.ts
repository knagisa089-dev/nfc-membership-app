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
    include: { subscription: true, nfcTag: true },
    orderBy: { createdAt: 'desc' },
  })

  const rows = [
    ['名前', 'メール', '電話番号', 'ステータス', '有効期限', 'タグUID', '登録日'],
    ...customers.map(c => [
      c.name,
      c.email ?? '',
      c.phone ?? '',
      c.subscription?.status === 'ACTIVE' ? '有効' :
        c.subscription?.status === 'EXPIRED' ? '期限切れ' :
        c.subscription?.status === 'SUSPENDED' ? '停止中' : '未設定',
      c.subscription?.expiresAt ? new Date(c.subscription.expiresAt).toLocaleDateString('ja-JP') : '',
      c.nfcTag?.uid ?? '',
      new Date(c.createdAt).toLocaleDateString('ja-JP'),
    ])
  ]

  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const bom = '\uFEFF'

  return new NextResponse(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="customers.csv"',
    },
  })
}