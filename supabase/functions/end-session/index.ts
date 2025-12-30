import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EndSessionRequest {
  sessionId: string;
  endReason?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { sessionId, endReason }: EndSessionRequest = await req.json();
    console.log('Ending session:', { sessionId, userId: user.id, endReason });

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('call_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      throw new Error('Session not found');
    }

    if (session.status !== 'active') {
      return new Response(JSON.stringify({ error: 'Session already ended' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate duration and costs
    const startTime = new Date(session.start_time);
    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const durationMinutes = Math.ceil(durationSeconds / 60); // Bill full minutes

    const totalCost = durationMinutes * Number(session.rate_per_minute);
    const hostEarnings = durationMinutes * Number(session.host_rate_per_minute);
    const adminCommission = durationMinutes * Number(session.admin_rate_per_minute);

    console.log('Session billing:', { durationMinutes, totalCost, hostEarnings, adminCommission });

    // Update session
    const { error: updateSessionError } = await supabase
      .from('call_sessions')
      .update({
        end_time: endTime.toISOString(),
        duration_seconds: durationSeconds,
        total_cost: totalCost,
        host_earnings: hostEarnings,
        admin_commission: adminCommission,
        status: 'completed',
        end_reason: endReason || 'user_ended',
      })
      .eq('id', sessionId);

    if (updateSessionError) throw updateSessionError;

    // Deduct from caller wallet
    const { data: callerWallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', session.caller_id)
      .single();

    if (callerWallet) {
      const newCallerBalance = Math.max(0, Number(callerWallet.balance) - totalCost);
      
      await supabase
        .from('wallets')
        .update({
          balance: newCallerBalance,
          total_spent: Number(callerWallet.total_spent) + totalCost,
        })
        .eq('user_id', session.caller_id);

      await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: callerWallet.id,
          user_id: session.caller_id,
          amount: -totalCost,
          transaction_type: 'deduction',
          description: `${session.session_type === 'voice' ? 'Voice' : 'Video'} call - ${durationMinutes} min`,
          reference_id: sessionId,
          balance_after: newCallerBalance,
        });
    }

    // Add to host wallet
    const { data: hostWallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', session.host_id)
      .single();

    if (hostWallet) {
      const newHostBalance = Number(hostWallet.balance) + hostEarnings;
      
      await supabase
        .from('wallets')
        .update({
          balance: newHostBalance,
          total_earned: Number(hostWallet.total_earned) + hostEarnings,
        })
        .eq('user_id', session.host_id);

      await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: hostWallet.id,
          user_id: session.host_id,
          amount: hostEarnings,
          transaction_type: 'reward',
          description: `${session.session_type === 'voice' ? 'Voice' : 'Video'} call earnings - ${durationMinutes} min`,
          reference_id: sessionId,
          balance_after: newHostBalance,
        });

      // Update host stats
      await supabase
        .from('host_settings')
        .update({
          total_calls: hostWallet.total_earned ? Number(hostWallet.total_earned) + 1 : 1,
          total_minutes: durationMinutes,
        })
        .eq('user_id', session.host_id);
    }

    // Set host back to online
    await supabase
      .from('profiles')
      .update({ availability: 'online' })
      .eq('user_id', session.host_id);

    console.log('Session ended successfully');

    return new Response(JSON.stringify({
      success: true,
      session: {
        ...session,
        duration_seconds: durationSeconds,
        total_cost: totalCost,
        host_earnings: hostEarnings,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('End session error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
