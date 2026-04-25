import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const prisma = new PrismaClient()

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Record<string, any>
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0].price.id

    let plan: 'STANDARD' | 'PRO' = 'STANDARD'
    if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
      plan = 'PRO'
    }

    await prisma.tenant.updateMany({
      where: { stripeCustomerId: customerId },
      data: { plan, stripeSubId: subscriptionId },
    })
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Record<string, any>
    const customerId = subscription.customer as string

    await prisma.tenant.updateMany({
      where: { stripeCustomerId: customerId },
      data: { plan: 'FREE', stripeSubId: null },
    })
  }

  return NextResponse.json({ ok: true })
}