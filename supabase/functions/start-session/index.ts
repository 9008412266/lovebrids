import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Billing rates
const VOICE_RATES = { caller: 5, host: 2, admin: 3 };
const VIDEO_RATES = { caller: 8, host: 4, admin: 4 };

interface StartSessionRequest {
  hostId: string;
  sessionType: 'voice' | 'video';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get caller from auth
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: caller }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !caller) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { hostId, sessionType }: StartSessionRequest = await req.json();
    console.log('Starting session:', { callerId: caller.id, hostId, sessionType });

    // Check caller wallet balance
    const { data: callerWallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', caller.id)
      .single();

    if (walletError || !callerWallet) {
      throw new Error('Caller wallet not found');
    }

    const rates = sessionType === 'voice' ? VOICE_RATES : VIDEO_RATES;
    const minBalance = rates.caller * 2; // Minimum 2 minutes balance

    if (Number(callerWallet.balance) < minBalance) {
      return new Response(JSON.stringify({ 
        error: 'Insufficient balance',
        required: minBalance,
        current: callerWallet.balance 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check host availability
    const { data: hostProfile, error: hostError } = await supabase
      .from('profiles')
      .select('*, kyc_details(*)')
      .eq('user_id', hostId)
      .single();

    if (hostError || !hostProfile) {
      throw new Error('Host not found');
    }

    if (hostProfile.availability !== 'online') {
      return new Response(JSON.stringify({ error: 'Host is not available' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check host verification
    const { data: kycData } = await supabase
      .from('kyc_details')
      .select('verification_status')
      .eq('user_id', hostId)
      .single();

    if (!kycData || kycData.verification_status !== 'approved') {
      return new Response(JSON.stringify({ error: 'Host is not verified' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Set host to busy
    await supabase
      .from('profiles')
      .update({ availability: 'busy' })
      .eq('user_id', hostId);

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from('call_sessions')
      .insert({
        caller_id: caller.id,
        host_id: hostId,
        session_type: sessionType,
        rate_per_minute: rates.caller,
        host_rate_per_minute: rates.host,
        admin_rate_per_minute: rates.admin,
        status: 'active',
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      throw sessionError;
    }

    console.log('Session started:', session.id);

    return new Response(JSON.stringify({
      success: true,
      session,
      rates,
      callerBalance: callerWallet.balance,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Start session error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
