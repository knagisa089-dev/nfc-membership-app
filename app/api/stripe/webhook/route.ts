import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ''
    )
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  // サブスク決済完了
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Record<string, any>
    const customerId = session.customer as string
    const plan = session.metadata?.plan

    if (plan === 'LIFETIME') {
      // 買い切りプラン
      await prisma.tenant.updateMany({
        where: { stripeCustomerId: customerId },
        data: { plan: 'LIFETIME' },
      })
    } else {
      // サブスクプラン
      const subscriptionId = session.subscription as string
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0].price.id

        let newPlan: 'STANDARD' | 'PRO' = 'STANDARD'
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          newPlan = 'PRO'
        }

        await prisma.tenant.updateMany({
          where: { stripeCustomerId: customerId },
          data: { plan: newPlan, stripeSubId: subscriptionId },
        })
      }
    }
  }

  // サブスク解約
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Record<string, any>
    const customerId = subscription.customer as string

    // ライフタイムは解約されない
    const tenant = await prisma.tenant.findFirst({
      where: { stripeCustomerId: customerId }
    })
    if (tenant && tenant.plan !== 'LIFETIME') {
      await prisma.tenant.updateMany({
        where: { stripeCustomerId: customerId },
        data: { plan: 'FREE', stripeSubId: null },
      })
    }
  }

  return NextResponse.json({ ok: true })
}