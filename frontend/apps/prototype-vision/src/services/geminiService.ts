import { GoogleGenAI } from "@google/genai";
import { Tone } from "../views/reputacao-online/types";

export const generateAIResponse = async (reviewText: string, rating: number, tone: string): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

    if (!apiKey) {
      console.warn('⚠️ Gemini API Key não configurada. Retornando resposta mock.');
      return getMockResponse(rating, tone);
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      És um gestor de um restaurante em Portugal.
      Gera uma resposta curta, educada e eficaz para uma avaliação de um cliente.

      Usa Português de Portugal (PT-PT). Evita o uso de "você" e prefere o tratamento na 3ª pessoa ou plural ("ficamos felizes", "esperamos vê-lo").

      Detalhes da Avaliação:
      - Pontuação: ${rating}/5 estrelas
      - Conteúdo: "${reviewText}"
      - Tom pretendido: ${tone}

      Requisitos:
      - Mantém a resposta com menos de 80 palavras.
      - Se a nota for baixa (1-2), sê empático, pede desculpa e convida a uma resolução privada.
      - Se a nota for alta (4-5), agradece calorosamente a visita e o elogio.
      - Menciona detalhes específicos citados na avaliação.
      - Termina com um encerramento amigável como "A Gerência" ou "Equipa ${import.meta.env.VITE_APP_NAME || 'iaMenu'}".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });

    return response.text || "Lamento, não consegui gerar uma resposta neste momento. Por favor, tente novamente.";
  } catch (error: unknown) {
    console.error("Erro ao gerar resposta IA:", error);
    return getMockResponse(rating, tone);
  }
};

const getMockResponse = (rating: number, tone: string): string => {
  if (rating <= 2) {
    if (tone === Tone.APOLOGETIC) {
      return "Lamentamos profundamente que a sua experiência não tenha correspondido às suas expectativas. A sua opinião é muito importante para nós e gostaríamos de ter a oportunidade de corrigir a situação. Por favor, contacte-nos diretamente para resolvermos este assunto. Com os melhores cumprimentos, A Gerência.";
    } else if (tone === Tone.FRIENDLY) {
      return "Olá! Ficamos muito tristes ao ler o seu comentário. Queremos fazer melhor! Pode contactar-nos diretamente para conversarmos sobre como podemos melhorar a sua próxima visita? Aguardamos o seu contacto. Obrigado, A Equipa.";
    } else {
      return "Agradecemos o seu feedback e lamentamos que a experiência não tenha sido satisfatória. Tomaremos as medidas necessárias para melhorar. Por favor, contacte-nos para podermos resolver esta situação. Atenciosamente, A Gerência.";
    }
  } else if (rating >= 4) {
    if (tone === Tone.FRIENDLY) {
      return "Olá! Muito obrigado pelas palavras simpáticas! Ficamos super felizes por ter gostado da experiência. Esperamos vê-lo em breve por cá! Um abraço, A Equipa.";
    } else if (tone === Tone.APOLOGETIC) {
      return "Muito obrigado pelo seu feedback positivo! Ficamos contentes por ter apreciado a sua visita. Esperamos recebê-lo novamente em breve. Com os melhores cumprimentos, A Gerência.";
    } else {
      return "Agradecemos o seu comentário positivo. É um prazer saber que apreciou a sua experiência connosco. Esperamos recebê-lo novamente em breve. Atenciosamente, A Gerência.";
    }
  } else {
    return "Agradecemos o seu feedback. Trabalhamos continuamente para melhorar a experiência dos nossos clientes. Esperamos vê-lo novamente em breve. Com os melhores cumprimentos, A Gerência.";
  }
};
