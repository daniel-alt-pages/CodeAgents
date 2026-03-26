import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference, PreApproval } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.VITE_SITE_URL || 'http://localhost:5173' }));
app.use(express.json());

/* ═══ MERCADO PAGO CLIENT ═══ */
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 }
});
const preference = new Preference(mpClient);
const preApproval = new PreApproval(mpClient);

/* ═══ PLAN DEFINITIONS ═══ */
const PLANS = {
  shared: {
    id: 'plan-compartido',
    title: 'CodeAgents — Plan Compartido',
    description: 'Acceso completo a Gemini 3.1 Pro, Veo 3.1, Nano Banana Pro, Whisk, IA Studio. Correo proporcionado. Cupos ilimitados.',
    unit_price: Number(process.env.MP_PRICE_SHARED_COP) || 80000,
    currency_id: 'COP',
  },
  private: {
    id: 'plan-privado',
    title: 'CodeAgents — Plan Privado',
    description: 'Todas las herramientas + correo personal vinculado, más cuotas para trabajos pesados, solo 2 cupos, soporte prioritario.',
    unit_price: Number(process.env.MP_PRICE_PRIVATE_COP) || 220000,
    currency_id: 'COP',
  }
};



const SITE_URL = process.env.VITE_SITE_URL || 'http://localhost:5173';

/* ═══ CREATE PREFERENCE (ONE-TIME) ═══ */
app.post('/api/create-preference', async (req, res) => {
  try {
    const { plan, payer_email, payer_name } = req.body;

    if (!process.env.MP_ACCESS_TOKEN) {
      console.error('[MP] ❌ MP_ACCESS_TOKEN not set in .env!');
      return res.status(500).json({ error: 'Access token no configurado.' });
    }

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ error: 'Plan inválido. Usa "shared" o "private".' });
    }

    const planData = PLANS[plan];
    console.log(`[MP] Creating preference for plan: ${plan} ($${planData.unit_price})`);

    const isProduction = SITE_URL.startsWith('https://');

    const preferenceBody = {
      items: [
        {
          id: planData.id,
          title: `${planData.title} (Mensual)`,
          description: planData.description,
          quantity: 1,
          unit_price: planData.unit_price,
          currency_id: planData.currency_id,
        }
      ],
      payer: {
        ...(payer_email && { email: payer_email }),
        ...(payer_name && { name: payer_name }),
      },
      external_reference: `codeagents-${plan}-${Date.now()}`,
      statement_descriptor: 'CODEAGENTS',
      expires: false,
      binary_mode: false,
    };

    if (isProduction) {
      preferenceBody.back_urls = {
        success: `${SITE_URL}/?payment=success&plan=${plan}`,
        failure: `${SITE_URL}/?payment=failure&plan=${plan}`,
        pending: `${SITE_URL}/?payment=pending&plan=${plan}`,
      };
      preferenceBody.auto_return = 'approved';
    }

    const result = await preference.create({ body: preferenceBody });
    console.log(`[MP] ✅ Preference created: ${result.id}`);

    res.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (error) {
    console.error('[MP] ❌ Error creating preference:');
    console.error('  Message:', error.message);
    if (error.cause) console.error('  Cause:', JSON.stringify(error.cause, null, 2));
    if (error.status) console.error('  Status:', error.status);
    console.error('  Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    res.status(500).json({ error: 'Error al crear preferencia.', detail: error.message });
  }
});

/* ═══ CREATE SUBSCRIPTION (RECURRING) ═══ */
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { plan, payer_email } = req.body;

    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Access token no configurado.' });
    }

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ error: 'Plan inválido. Usa "shared" o "private".' });
    }

    const planData = PLANS[plan];
    console.log(`[MP] Creating subscription for plan: ${plan} ($${planData.unit_price} USD/mes)`);

    const isProduction = SITE_URL.startsWith('https://');

    const subscriptionBody = {
      reason: `${planData.title} — Suscripción Mensual`,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: planData.unit_price,
        currency_id: planData.currency_id,
      },
      external_reference: `codeagents-sub-${plan}-${Date.now()}`,
      status: 'pending',
      // MP PreApproval STRICTLY REQUIRES https:// URLs. It will fail with 400 if using http://localhost
      back_url: isProduction 
        ? `${SITE_URL}/?subscription=active&plan=${plan}`
        : `https://www.mercadopago.com.co`, // Dummy HTTPS url to bypass MP local validation error
      ...(payer_email && { payer_email }),
    };

    const result = await preApproval.create({ body: subscriptionBody });
    console.log(`[MP] ✅ Subscription created: ${result.id}`);

    res.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      status: result.status,
    });
  } catch (error) {
    console.error('[MP] ❌ Error creating subscription:');
    console.error('  Message:', error.message);
    if (error.cause) console.error('  Cause:', JSON.stringify(error.cause, null, 2));
    if (error.status) console.error('  Status:', error.status);
    console.error('  Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    res.status(500).json({ error: 'Error al crear suscripción.', detail: error.message });
  }
});

/* ═══ HEALTH CHECK ═══ */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', plans: Object.keys(PLANS), endpoints: ['create-preference', 'create-subscription'] });
});

/* ═══ START ═══ */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n⚡ CodeAgents API running on http://localhost:${PORT}`);
  console.log(`   → POST /api/create-preference    { plan, payer_email? }`);
  console.log(`   → POST /api/create-subscription   { plan, payer_email? }`);
  console.log(`   → GET  /api/health\n`);
});
