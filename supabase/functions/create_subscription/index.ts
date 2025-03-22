import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { serve } from 'https://deno.land/std@0.114.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.25.0?target=denonext';
import { createClient } from 'https://esm.sh/v135/@supabase/supabase-js@2.46.2/dist/module/index.js';

import { corsHeaders } from '../_shared/cors.ts';

interface iSubscribeRequest {
  company_id: string;
  price_id: string;
  name: string;
  email: string;
  phone: string;
}

interface iCustomer {
  company_id: string;
  stripe_customer_id: string;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') as string;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const STRIPE_API_KEY = Deno.env.get('STRIPE_API_KEY') as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const stripeClient = new Stripe(STRIPE_API_KEY);

async function getCustomerFromCompanyId(company_id: string) {
  const { data, error } = await supabase.from('customers').select('*').eq('company_id', company_id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

async function createOrRetrieveCustomer(stripeClient: any, company_id: string, email: string, name: string, phone: string): Promise<iCustomer> {
  const customer = await getCustomerFromCompanyId(company_id);
  if (customer) return customer;
  if (!company_id) throw new Error('O ID da empresa é obrigatório');
  if (!email) throw new Error('O e-mail é obrigatório');

  const stripeCustomer = await stripeClient.customers.create({
    email,
    name,
    phone,
  });

  const customerData = {
    company_id,
    stripe_customer_id: stripeCustomer.id,
  };
  const { data, error } = await supabase.from('customers').insert(customerData).select().single();
  if (error) throw new Error(error.message);

  return data as iCustomer;
}

serve(async req => {
  const headers = {
    ...corsHeaders(req.headers.get('Origin') || 'null'),
    'Content-Type': 'application/json',
  };

  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Usuário não autenticado');

    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabase.auth.getUser(token);
    if (!data) throw new Error('Erro ao obter usuário. Token inválido');

    const { company_id, price_id, name, email, phone }: iSubscribeRequest = await req.json();
    if (!company_id) throw new Error('É necessário informar o ID da empresa');
    if (!price_id) throw new Error('É necessário informar o ID do preço');

    const customer = await createOrRetrieveCustomer(stripeClient, company_id, email, name, phone);
    if (!customer) throw new Error('Erro ao criar cliente');

    const customerSubscriptions = await stripeClient.subscriptions.list({
      customer: customer.stripe_customer_id,
    });
    const activeSubscriptions = customerSubscriptions.data.filter((subscription: { status: string }) => subscription.status === 'active');
    if (activeSubscriptions.length > 0) throw new Error('Cliente já possui uma ou mais assinaturas ativas');

    const subscription = await stripeClient.subscriptions.create({
      customer: customer.stripe_customer_id,
      items: [{ price: price_id }],
      trial_period_days: 14,
    });

    return new Response(JSON.stringify(subscription), { headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Erro ao criar assinatura' }), { headers, status: 400 });
  }
});
