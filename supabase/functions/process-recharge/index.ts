import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLATFORM_FEE_PERCENT = 3;
const GST_PERCENT = 10;

interface RechargeRequest {
  baseAmount: number;
  bonusPercent: number;
  offerTag?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { baseAmount, bonusPercent, offerTag }: RechargeRequest = await req.json();
    console.log('Processing recharge:', { userId: user.id, baseAmount, bonusPercent });

    // Calculate amounts
    const platformFee = (baseAmount * PLATFORM_FEE_PERCENT) / 100;
    const subtotal = baseAmount + platformFee;
    const gstAmount = (subtotal * GST_PERCENT) / 100;
    const totalPaid = subtotal + gstAmount;
    const bonusAmount = (baseAmount * bonusPercent) / 100;
    const creditsReceived = baseAmount + bonusAmount;

    // Create recharge order
    const { data: order, error: orderError } = await supabase
      .from('recharge_orders')
      .insert({
        user_id: user.id,
        base_amount: baseAmount,
        platform_fee: platformFee,
        gst_amount: gstAmount,
        total_paid: totalPaid,
        bonus_percent: bonusPercent,
        bonus_amount: bonusAmount,
        credits_received: creditsReceived,
        offer_tag: offerTag,
        status: 'completed', // For demo, auto-complete
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw orderError;
    }

    // Get user wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (walletError) {
      console.error('Wallet fetch error:', walletError);
      throw walletError;
    }

    const newBalance = Number(wallet.balance) + creditsReceived;

    // Update wallet balance
    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        balance: newBalance,
        total_recharged: Number(wallet.total_recharged) + creditsReceived,
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Wallet update error:', updateError);
      throw updateError;
    }

    // Create transaction record
    const { error: txError } = await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: wallet.id,
        user_id: user.id,
        amount: creditsReceived,
        transaction_type: 'recharge',
        description: `Wallet Top-up${offerTag ? ` (${offerTag})` : ''}`,
        reference_id: order.id,
        balance_after: newBalance,
      });

    if (txError) {
      console.error('Transaction record error:', txError);
      throw txError;
    }

    console.log('Recharge completed successfully:', { orderId: order.id, newBalance });

    return new Response(JSON.stringify({
      success: true,
      order,
      newBalance,
      creditsReceived,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Recharge error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
