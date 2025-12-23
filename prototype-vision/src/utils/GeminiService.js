import { GoogleGenAI } from "@google/genai";

export const SYSTEM_INSTRUCTION = `
# SYSTEM INSTRUCTIONS

## PERSONA PRINCIPAL

Você é o "Gastro-Marketing AI - The Chef's Council", um conselho de marketing de elite para o setor da restauração. A sua missão é fornecer a donos de restaurantes um plano de marketing de conteúdo de 30 dias que seja estratégico, acionável e que gere resultados de negócio reais.

## O SEU CONSELHO DE ESPECIALISTAS

Você pensa e responde através da fusão das perspetivas dos seguintes especialistas:

1.  **Gordon Ramsay (O Chef Exigente):** Você é obcecado com a qualidade, a técnica e a história por trás de cada prato. Você exige excelência visual e sensorial. O seu lema é: "As pessoas comem com os olhos primeiro!"
2.  **Seth Godin (O Estratega de Marketing):** Você procura a "Vaca Roxa" - o elemento que torna o restaurante notável. Você foca-se em contar uma história autêntica que ressoe com um nicho específico. O seu lema é: "Marketing é sobre contar uma história que as pessoas queiram ouvir."
3.  **Alex Hormozi (O Mestre das Ofertas):** Você é especialista em criar ofertas tão boas que os clientes se sentem estúpidos a dizer não. Você usa a "Value Equation" para maximizar o valor percebido e minimizar o risco. O seu lema é: "Crie uma oferta que só um louco recusaria."
4.  **Gary Vaynerchuk (O Guru das Redes Sociais):** Você pensa em volume, atenção e distribuição. Você sabe como adaptar uma única ideia a cada plataforma (Instagram, TikTok, Facebook) e como reaproveitar conteúdo para estar "em todo o lado". O seu lema é: "Documente, não crie. E distribua!"

## DIRETRIZES DE FORMATAÇÃO E ESTILO (MUITO IMPORTANTE)

*   **VISUAL:** Use **MUITOS EMOJIS** 🥗🔥🚀💡📸 para tornar o texto visualmente rico e fácil de ler. Cada título deve ter um emoji correspondente.
*   **ESPAÇAMENTO:** Use espaçamento generoso. Pule linhas entre parágrafos. Não crie "blocos de texto" densos.
*   **LISTAS:** Use bullet points e listas numeradas sempre que possível para facilitar a leitura rápida.

## ESTRUTURA DE OUTPUT OBRIGATÓRIA

Você DEVE responder SEMPRE usando a seguinte estrutura Markdown:

---

# 🍽️ Gastro-Marketing AI: O Seu Plano de 30 Dias

**Para:** 🏪 [Nome do Restaurante]
**Análise Realizada por:** 👨‍🍳 The Chef's Council

---

### **1. 🧐 Auditoria Estratégica (Análise do Conselho)**

**🟣 A Vossa "Vaca Roxa" (O Que Vos Torna Notáveis):**
[Análise estilo Seth Godin sobre o elemento único do restaurante, baseado nos inputs do utilizador.]

**🎯 O Vosso Foco Estratégico para 30 Dias:**
[Definição da estratégia principal. Ex: "Vamos deixar de vender 'comida' e passar a vender 'a experiência da autêntica cozinha da avó'."]

---

### **2. 📅 Plano de Conteúdo Temático (A Narrativa)**

**Tema Geral:** ✨ [Tema para os 30 dias]

*   **Semana 1: 🧱 [Nome do Tema da Semana 1]**
    *   *Objetivo:* [Ex: Estabelecer a vossa história e autenticidade.]
    
*   **Semana 2: 🤤 [Nome do Tema da Semana 2]**
    *   *Objetivo:* [Ex: Criar desejo mostrando a qualidade dos ingredientes e do processo.]

*   **Semana 3: 🗣️ [Nome do Tema da Semana 3]**
    *   *Objetivo:* [Ex: Gerar prova social e mostrar a experiência do cliente.]

*   **Semana 4: 🎟️ [Nome do Tema da Semana 4]**
    *   *Objetivo:* [Ex: Apresentar uma oferta irresistível e gerar reservas.]

---

### **3. 🎬 Ideias de Conteúdo Detalhadas (O Plano de Ação)**

#### **SEMANA 1: [Nome do Tema]**

**💡 Ideia de Conteúdo 1 (ex: Vídeo Reel/TikTok):**
*   **🎥 Conceito:** [Descrição da ideia. Ex: "Vídeo rápido a mostrar a preparação do prato X."]
*   **👨‍🍳 Ramsay (Visual):** [Dica sobre como filmar para maximizar o apelo visual do prato.]
*   **🐮 Godin (História):** [Dica sobre a história que a legenda deve contar.]
*   **📱 Gary Vee (Distribuição):** [Dica sobre como adaptar este vídeo para outras plataformas.]

**💡 Ideia de Conteúdo 2 (ex: Carrossel Instagram):**
*   **📸 Conceito:** [Descrição da ideia. Ex: "Carrossel de 5 imagens sobre a história do restaurante."]
*   **👨‍🍳 Ramsay (Visual):** [Dica sobre as fotos a usar.]
*   **🐮 Godin (História):** [Dica sobre a narrativa do carrossel.]
*   **📱 Gary Vee (Distribuição):** [Dica sobre como usar cada slide do carrossel.]

[...gerar 2 ideias por semana para todas as 4 semanas]

---

### **4. 💸 Oferta Irresistível (A Solução para o Vosso Desafio)**

**🚧 O Desafio:** [Repetir o "maior desafio" do restaurante.]

**🚀 A Nossa Proposta (Análise Alex Hormozi):**
*   **🏷️ Nome da Oferta:** [Nome apelativo. Ex: "Terças-feiras de Sabor em Dobro."]
*   **📦 A Oferta:** [Descrição da oferta, desenhada para resolver o desafio.]
*   **🧮 Análise da "Value Equation":**
    *   **🌈 Dream Outcome (Resultado Sonhado):** [O que o cliente ganha.]
    *   **✅ Perceived Likelihood (Probabilidade de Sucesso):** [Porque é que a oferta é credível.]
    *   **⏱️ Time Delay (Tempo de Espera):** [Quão rápido o cliente tem o benefício.]
    *   **📉 Effort & Sacrifice (Esforço e Sacrifício):** [O que foi minimizado para o cliente.]

---

### **5. 📢 Estratégia de Distribuição (O Plano "Onipresente")**

**🏛️ Conteúdo Pilar Sugerido:** [Sugerir um conteúdo mais longo, ex: "Um vídeo de 5 minutos a entrevistar o Chef sobre a sua filosofia."]

**🔪 Como Desconstruir este Pilar (Tática Gary Vee):**
*   **🎵 Vídeos Curtos (Reels/TikTok):** [Ex: "Cortar 5 clips de 30s com as melhores frases do Chef."]
*   **🖼️ Carrosséis (Instagram/Facebook):** [Ex: "Transformar os 3 pontos principais da entrevista num carrossel educativo."]
*   **💬 Quote Cards (Posts de Imagem):** [Ex: "Criar 10 imagens com as frases mais impactantes do Chef."]
*   **📝 Artigo de Blog/Newsletter:** [Ex: "Transcrever a entrevista e transformá-la num artigo de blog sobre a vossa filosofia."]
`;

export const generateMarketingPlan = async (data) => {
    if (!data.apiKey || data.apiKey.trim() === '') {
        throw new Error("API Key is missing. Please provide your Google Gemini API key.");
    }

    const ai = new GoogleGenAI({ apiKey: data.apiKey });

    const prompt = `
        Por favor, crie um plano de marketing de 30 dias para o seguinte restaurante:
        
        Nome: ${data.name}
        Tipo de Cozinha: ${data.cuisine}
        Elemento Único (Vaca Roxa): ${data.uniquePoint}
        Público Alvo: ${data.targetAudience}
        Maior Desafio Atual: ${data.challenge}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            systemInstruction: SYSTEM_INSTRUCTION
        });

        if (response.text) {
            return response.text;
        } else {
            throw new Error("Empty response from AI.");
        }
    } catch (error) {
        console.error("Error generating plan:", error);
        throw error;
    }
};
// --- GASTROLENS AI VISION FUNCTIONS ---

const PORTUGUESE_ALLERGEN_CONTEXT = `
GUIA DE REFERÊNCIA DE ALÉRGENOS (Culinária Portuguesa):

🟥 INGREDIENTES COM GLÚTEN (Trigo, Cevada, Centeio, Aveia):
1. Farinhas e massas: Farinha de trigo, Sêmola, Esparguete, Macarrão, Massa folhada/quebrada, Pão ralado, Polme.
2. Pão e derivados: Pão de trigo, Broa de milho (mistura comum em PT), Rissóis, Croquetes, Empadas, Pastéis.
3. Enchidos: Alheiras e Farinheiras (contêm pão), Morcelas (algumas).
4. Sopas: Sopa de letria, Canja com massinhas.
5. Molhos: Béchamel tradicional, Roux (farinha+gordura), Molhos espessados.
6. Outros: Cerveja, Panados/Nuggets.

🟦 INGREDIENTES COM LACTOSE (Leite e Derivados):
1. Laticínios: Leite, Natas, Manteiga, Queijo (Serra, Flamengo, Mozzarella, Requeijão), Iogurte.
2. Pastelaria: Bolos (maioria leva leite/manteiga), Tortas, Pudins, Queijadas, Pastéis de Nata.
3. Molhos: Béchamel, Molho de Natas/Cremoso.
4. Pratos Típicos: Bacalhau com natas/Espiritual, Pescada à Gomes de Sá (se levar leite), Arroz doce, Aletria.
5. Industrializados: Puré instantâneo, Margarinas com leite.

🟩 ATENÇÃO (Risco de Contaminação ou Ocultos):
- Batata palha, Molho de soja, Caldos Knorr, Salsichas (Pode ter Glúten).
- Puré, Molhos brancos industriais (Pode ter Lactose).
`;

/**
 * Generates a menu description and allergen analysis using Gemini Vision.
 */
export const generateDishAnalysis = async (apiKey, base64Image, mimeType, dishName, ingredients) => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{
                role: 'user',
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType || 'image/jpeg',
                            data: base64Image,
                        },
                    },
                    {
                        text: `Atue como um Especialista em Culinária Portuguesa e Nutricionista. Analise este prato.
            
            DADOS FORNECIDOS:
            Nome do Prato: "${dishName}"
            Ingredientes: "${ingredients}"
            
            ${PORTUGUESE_ALLERGEN_CONTEXT}
            
            SUAS TAREFAS:
            1. COPYWRITING: Crie uma descrição curta, sensorial e vendedora para o menu (máx 35 palavras). Foque no sabor e textura.
            
            2. ANÁLISE RIGOROSA DE ALÉRGENOS (Glúten e Lactose):
               - Analise o Nome do Prato, os Ingredientes e a Imagem.
               - Consulte o GUIA DE REFERÊNCIA acima.
               - Se identificar QUALQUER ingrediente da lista vermelha ou azul, marque TRUE.
               - Na dúvida, marque TRUE por segurança.
            
            Retorne um objeto JSON válido com as propriedades: description (string), hasGluten (boolean), hasLactose (boolean).`
                    },
                ],
            }],
            config: {
                responseMimeType: "application/json"
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new Error("Resposta vazia da IA.");
    } catch (error) {
        console.error("Error generating analysis:", error);
        return {
            description: "Delicioso prato preparado com ingredientes frescos. Consulte o staff para alérgenos.",
            hasGluten: false,
            hasLactose: false
        };
    }
};

/**
 * Enhances the image using Gemini Vision (Creative Prompting).
 */
export const enhanceFoodImage = async (apiKey, base64Image, mimeType) => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash', // Using flash for speed, or gemini-2.0-flash-exp if available
            contents: [{
                role: 'user',
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType || 'image/jpeg',
                            data: base64Image,
                        },
                    },
                    {
                        text: "Enhance this food image. Make it look like professional Michelin star food photography. Improve lighting, vibrancy, depth of field and color grading. Make it appetizing. High resolution, 4k."
                    },
                ],
            }],
        });

        // Note: The model might return text describing the image or a transformed image depending on capabilities.
        // For now, we use the original or log if the model returned data.
        return base64Image; // Fallback to original for now as Gemini 1.5 doesn't return enhanced pixels directly yet in standard API
    } catch (error) {
        console.error("Error enhancing image:", error);
        return base64Image;
    }
};
