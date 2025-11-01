/**
 * Supabase Edge Function: revenuecat-webhook
 * Mirrors RevenueCat entitlements to user_entitlements table
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req: Request) => {
  try {
    // Parse RevenueCat webhook payload
    const payload = await req.json();

    console.log('RevenueCat webhook received:', payload.type);

    const appUserId = payload.event?.app_user_id;
    if (!appUserId) {
      return new Response(JSON.stringify({ error: 'Missing app_user_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract entitlement status
    const proEntitlement = payload.event?.product_id === 'pro';
    const isPro = Boolean(
      payload.event?.entitlement_ids?.includes('pro') ||
        payload.event?.type === 'INITIAL_PURCHASE' ||
        payload.event?.type === 'RENEWAL'
    );

    const expiresAt = payload.event?.expiration_at_ms
      ? new Date(payload.event.expiration_at_ms).toISOString()
      : null;

    // Upsert entitlement
    const { error } = await supabase.from('user_entitlements').upsert({
      user_id: appUserId,
      pro: isPro,
      max_routines: isPro ? 50 : 2,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error upserting entitlement:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`Entitlement updated for user ${appUserId}: pro=${isPro}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

