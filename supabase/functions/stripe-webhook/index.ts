import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.2';
import Stripe from 'https://esm.sh/stripe@14.25.0?target=denonext';

interface iPriceData {
  id: string;
  product_id: string;
  active: boolean;
  currency: string;
  description: string | null;
  type: string;
  unit_amount: number | null;
  interval: string;
  interval_count: number;
  trial_period_days: number | null;
  metadata: unknown;
  lookup_key?: string;
}

interface iSubscriptionData {
  id: string;
  company_id: string;
  status: string;
  metadata: unknown;
  price_id: string;
  quantity: number;
  cancel_at_period_end: boolean;
  current_period_start: Date | null;
  current_period_end: Date | null;
  ended_at: Date | null;
  cancel_at: Date | null;
  canceled_at: Date | null;
  trial_start: Date | null;
  trial_end: Date | null;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string);
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error } = await supabase.from('products').upsert([productData]);
  if (error) throw error;

  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Partial<iPriceData> = {
    id: price.id,
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? undefined,
    type: price.type,
    unit_amount: price.unit_amount ?? undefined,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata,
  };

  const { data } = await supabase.from('prices').select('id').match({ unit_amount: priceData.unit_amount, active: true }).maybeSingle();
  if (data) priceData.id = data.id;
  if (price.product) priceData.product_id = price.product as string;

  const { error } = await supabase.from('prices').upsert([priceData]);
  if (error) throw error;

  console.log(`Price inserted/updated: ${price.id}`);
};

const subscriptionStatusChangedEvent = async (event: Stripe.Event) => {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;

  await manageSubscriptionStatusChange(subscriptionId, customerId);
};

const checkoutSessionCompletedEvent = async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.mode !== 'subscription') return;

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  await manageSubscriptionStatusChange(subscriptionId, customerId);
};

const convertDate = (date: number | null) => (date ? new Date(date * 1000) : null);

const manageSubscriptionStatusChange = async (subscriptionId: string, customerId: string) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const { data: customerData } = await supabase.from('customers').select('company_id').eq('stripe_customer_id', customerId).single();
  if (!customerData) throw new Error('Customer not found');
  const { company_id } = customerData;

  const subscriptionData: Partial<iSubscriptionData> = {
    id: subscription.id,
    company_id,
    status: subscription.status,
    metadata: subscription.metadata,
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_start: convertDate(subscription.current_period_start),
    current_period_end: convertDate(subscription.current_period_end),
    ended_at: convertDate(subscription.ended_at),
    cancel_at: convertDate(subscription.cancel_at),
    canceled_at: convertDate(subscription.canceled_at),
    trial_start: convertDate(subscription.trial_start),
    trial_end: convertDate(subscription.trial_end),
  };

  const { error } = await supabase.from('subscriptions').upsert(subscriptionData);
  if (error) throw new Error(error.message);
};

Deno.serve(async request => {
  const signature = request.headers.get('Stripe-Signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET');

  const body = await request.text();
  let receivedEvent: Stripe.Event;

  try {
    if (!signature) return new Response('Webhook Error: Missing Stripe-Signature header', { status: 400 });
    if (!webhookSecret) return new Response('Webhook Error: Missing Stripe webhook secret', { status: 400 });

    receivedEvent = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret, undefined, cryptoProvider);
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }

  if (relevantEvents.has(receivedEvent.type)) {
    try {
      switch (receivedEvent.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(receivedEvent?.data?.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(receivedEvent?.data?.object as Stripe.Price);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.deleted':
        case 'customer.subscription.updated':
          await subscriptionStatusChangedEvent(receivedEvent);
          break;
        case 'checkout.session.completed':
          await checkoutSessionCompletedEvent(receivedEvent);
          break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Webhook handler failed' }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});
