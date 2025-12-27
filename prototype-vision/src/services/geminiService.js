import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export const generateChefResponse = async (userMessage, chatHistory = []) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: "Tu és o gerente do 'Restaurante O Pátio'. Estás a falar com o Chef João sobre encomendas de peixe e contactos de fornecedores. Sê profissional, direto e amigável. Responde em Português de Portugal.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpa, estou com dificuldades em responder agora. Podemos falar daqui a pouco?";
  }
};
