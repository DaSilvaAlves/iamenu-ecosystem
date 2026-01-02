/**
 * 🔥 VERCEL SERVERLESS FUNCTION - GastroLens AI
 *
 * Esta função faz o proxy seguro entre o frontend e a API do Google Gemini.
 * A API key fica SEGURA no servidor (variável de ambiente).
 * Os users NÃO precisam criar API key própria!
 */

export default async function handler(req, res) {
  // Configurar CORS para permitir chamadas do frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Responder a preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas aceitar POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { image, dishName, ingredients } = req.body;

    // Validações básicas
    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Obter API key das variáveis de ambiente (SEGURA!)
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY não configurada nas variáveis de ambiente!');
      return res.status(500).json({
        error: 'API key not configured. Please contact administrator.'
      });
    }

    // Preparar o prompt para o Gemini
    const prompt = `Você é um expert em gastronomia e fotografia de alimentos. Analise esta imagem de um prato chamado "${dishName || 'prato desconhecido'}".

${ingredients ? `Ingredientes principais: ${ingredients}` : ''}

Por favor, forneça uma análise completa em JSON com esta estrutura EXATA:

{
  "description": "Descrição apetitosa e profissional do prato (2-3 frases, foco em textura, cores, apresentação)",
  "hasGluten": boolean,
  "hasLactose": boolean,
  "hasNuts": boolean,
  "hasFish": boolean,
  "hasShellfish": boolean,
  "hasEggs": boolean,
  "hasSoy": boolean,
  "hasSesame": boolean,
  "hasSulfites": boolean,
  "hasCelery": boolean,
  "suggestions": [
    "Sugestão 1 de melhoria na apresentação ou fotografia",
    "Sugestão 2 de técnica culinária",
    "Sugestão 3 de marketing ou descrição"
  ],
  "estimatedCalories": número aproximado de calorias,
  "plateScore": número de 1 a 10 avaliando a apresentação visual
}

IMPORTANTE: Responda APENAS com o JSON válido, sem markdown, sem explicações adicionais.`;

    // Chamar a API do Gemini
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: image.split(',')[1] // Remover o prefixo data:image/jpeg;base64,
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('❌ Erro na API do Gemini:', errorData);
      return res.status(geminiResponse.status).json({
        error: 'Failed to analyze image',
        details: errorData
      });
    }

    const data = await geminiResponse.json();

    // Extrair o texto da resposta
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    // Limpar o texto (remover markdown se houver)
    let cleanText = rawText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\n?/g, '');
    }

    // Parse do JSON
    let analysis;
    try {
      analysis = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', cleanText);
      return res.status(500).json({
        error: 'Invalid JSON response from AI',
        rawResponse: cleanText
      });
    }

    // Retornar a análise
    return res.status(200).json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro na serverless function:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
