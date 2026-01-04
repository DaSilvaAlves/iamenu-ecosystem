
import { GoogleGenAI } from "@google/genai";
import { Tone } from "../types";

export const generateAIResponse = async (reviewText: string, rating: number, tone: Tone): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
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
      - Termina com um encerramento amigável como "A Gerência" ou "Equipa iaReputação".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Lamento, não consegui gerar uma resposta neste momento. Por favor, tente novamente.";
  } catch (error) {
    console.error("Erro ao gerar resposta IA:", error);
    return "Erro ao gerar resposta. Verifique a configuração da chave API.";
  }
};
