import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { threatName, threatType, severity } = await req.json();
    
    console.log('Generating virus logo for:', { threatName, threatType, severity });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Generate a menacing virus logo based on threat type
    const colorScheme = severity === 'critical' ? 'blood red and black' : 
                        severity === 'high' ? 'orange and dark grey' : 
                        severity === 'medium' ? 'yellow and dark' : 'green and grey';
    
    const virusStyle = threatType === 'TROJAN' ? 'a trojan horse made of malicious code' :
                       threatType === 'RANSOMWARE' ? 'a padlock with skull and chains' :
                       threatType === 'SPYWARE' ? 'an evil eye with digital circuits' :
                       threatType === 'PHISHING' ? 'a fishing hook with digital bait' :
                       threatType === 'MALWARE' ? 'a skull with binary code dripping' :
                       threatType === 'CRYPTOJACKER' ? 'a bitcoin symbol being eaten by virus' :
                       threatType === 'ADWARE' ? 'aggressive popup windows as monster' :
                       threatType === 'EXPLOIT' ? 'broken shield with lightning' :
                       'a menacing digital virus particle';

    const prompt = `Generate a sleek, modern logo icon for a malware/virus called "${threatName}". 
    Style: ${virusStyle}. 
    Color scheme: ${colorScheme}. 
    Make it look dangerous, digital, and cyberpunk. 
    Circular icon format, dark background, glowing neon accents.
    Professional quality, suitable for a crypto token logo.
    No text, just the icon.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(data));
      throw new Error('No image generated');
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        threatName,
        threatType 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating virus logo:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
