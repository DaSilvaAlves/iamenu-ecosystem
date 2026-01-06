
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const geminiService = {
  async analyzeRegionalPains(pains: any[], region: string) {
    const prompt = `Como um consultor especialista do iaMenu, analise os seguintes problemas (pains) reportados por donos de restaurantes na região de ${region}.
    Pains: ${JSON.stringify(pains)}
    
    Por favor, forneça um resumo das 3 principais tendências críticas e sugira uma solução prática do ecossistema iaMenu para cada uma. 
    Responda em Português de Portugal, com tom profissional e motivador.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text;
    } catch (error) {
      console.error("Gemini analysis error:", error);
      return "Não foi possível analisar as dores no momento. Tente novamente mais tarde.";
    }
  },

  async helpFramePain(briefDescription: string) {
    const prompt = `Ajude um dono de restaurante a articular melhor este problema de negócio: "${briefDescription}".
    Expanda o texto para ser mais claro e detalhado, focando no impacto operacional e financeiro.
    Mantenha o tom pragmático.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text;
    } catch (error) {
      return briefDescription;
    }
  }
};
