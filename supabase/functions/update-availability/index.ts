import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateAvailabilityRequest {
  availability: 'online' | 'offline';
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

    const { availability }: UpdateAvailabilityRequest = await req.json();
    console.log('Updating availability:', { userId: user.id, availability });

    // Check if host is verified
    const { data: kycData } = await supabase
      .from('kyc_details')
      .select('verification_status')
      .eq('user_id', user.id)
      .single();

    if (!kycData || kycData.verification_status !== 'approved') {
      return new Response(JSON.stringify({ 
        error: 'You must be verified to go online' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update availability
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ availability })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    console.log('Availability updated successfully');

    return new Response(JSON.stringify({
      success: true,
      availability,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Update availability error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
