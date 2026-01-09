import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BAGS_API_URL = 'https://public-api-v2.bags.fm/api/v1';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BAGS_API_KEY = Deno.env.get('BAGS_API_KEY');
    if (!BAGS_API_KEY) {
      console.error('BAGS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'BAGS_API_KEY is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      name,
      symbol,
      description,
      twitter,
      telegram,
      website,
      imageBase64,
      imageType,
      creatorPublicKey,
      initialBuyLamports = 0,
      feeClaimers,
    } = await req.json();

    console.log(`Creating Bags token: ${name} (${symbol}) for ${creatorPublicKey}`);
    console.log(`Initial buy: ${initialBuyLamports} lamports, Fee claimers: ${feeClaimers?.length || 0}`);

    // Validate required fields
    if (!name || !symbol || !description || !imageBase64 || !creatorPublicKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, symbol, description, image, and creatorPublicKey are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input lengths
    if (name.length > 32 || symbol.length > 10 || description.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Invalid field lengths' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert base64 to blob for upload
    const imageBytes = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
    const imageBlob = new Blob([imageBytes], { type: imageType || 'image/png' });
    
    // Determine file extension from mime type
    const extMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    const ext = extMap[imageType] || 'png';

    // Build form data for the single create-launch-transaction endpoint
    const formData = new FormData();
    formData.append('image', imageBlob, `token-image.${ext}`);
    formData.append('name', name);
    formData.append('symbol', symbol.toUpperCase().replace('$', ''));
    formData.append('description', description);
    formData.append('launchWallet', creatorPublicKey);
    
    // Optional social links
    if (twitter) formData.append('twitter', twitter);
    if (telegram) formData.append('telegram', telegram);
    if (website) formData.append('website', website);
    
    // Initial buy amount
    if (initialBuyLamports && initialBuyLamports > 0) {
      formData.append('initialBuyLamports', initialBuyLamports.toString());
      console.log(`Initial buy: ${initialBuyLamports} lamports`);
    }
    
    // Fee sharing configuration
    if (feeClaimers && Array.isArray(feeClaimers) && feeClaimers.length > 0) {
      // Calculate creator's share (remaining after all fee claimers)
      const totalClaimerBps = feeClaimers.reduce((sum: number, fc: any) => sum + (fc.bps || 0), 0);
      const creatorBps = 10000 - totalClaimerBps;
      
      if (creatorBps < 100) {
        return new Response(
          JSON.stringify({ error: 'Creator must receive at least 1% (100 bps)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Fee claimers as JSON array
      const feeClaimersData = feeClaimers.map((fc: any) => ({
        provider: fc.provider,
        username: fc.username.trim().replace('@', ''),
        bps: fc.bps,
      }));
      
      formData.append('feeClaimers', JSON.stringify(feeClaimersData));
      console.log(`Fee sharing with ${feeClaimers.length} partners, creator gets ${creatorBps / 100}%`);
    }

    console.log('Calling Bags API create-launch-transaction...');
    
    const response = await fetch(`${BAGS_API_URL}/token-launch/create-launch-transaction`, {
      method: 'POST',
      headers: {
        'x-api-key': BAGS_API_KEY,
      },
      body: formData,
    });

    const responseText = await response.text();
    console.log(`Bags API response status: ${response.status}`);
    
    if (!response.ok) {
      console.error('Bags API error:', responseText);
      
      // Try to parse error message
      let errorMessage = 'Failed to create token on Bags';
      try {
        const errorJson = JSON.parse(responseText);
        errorMessage = errorJson.error || errorJson.message || errorMessage;
      } catch {
        // Use response text if not JSON
        if (responseText.length < 200) {
          errorMessage = responseText;
        }
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse Bags API response:', responseText);
      return new Response(
        JSON.stringify({ error: 'Invalid response from Bags API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Bags token creation successful:', {
      tokenMint: result.tokenMint,
      hasTransaction: !!result.transaction,
    });

    // Return the transaction data for signing
    return new Response(
      JSON.stringify({
        success: true,
        transaction: result.transaction,
        tokenMint: result.tokenMint,
        metadataUri: result.metadataUri || result.tokenMetadata,
        imageUrl: result.imageUrl,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in create-bags-token:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
