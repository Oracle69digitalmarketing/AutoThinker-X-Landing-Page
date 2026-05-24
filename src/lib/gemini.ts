import { GoogleGenAI } from "@google/genai";

// Support both Vite-style and process.env style for different hosting environments
const getApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  return (globalThis as any).process?.env?.GEMINI_API_KEY || 
         (globalThis as any).process?.env?.VITE_GEMINI_API_KEY || "";
};

const apiKey = getApiKey();

export const hasValidKey = () => apiKey && apiKey.length > 10;

export const generateBlueprint = async (prompt: string) => {
  if (!hasValidKey()) {
    return {
      error: "Missing API Key",
      competitorAnalysis: "Please set VITE_GEMINI_API_KEY in your environment variables.",
      pitchDeckKeyPoints: ["API Key is required to generate this."],
      financialModel: "Configuration required.",
      mvpOutline: ["Check your .env file."]
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are AutoThinker X, an expert AI product strategist. 
    Based on the user's business idea, generate a concise "Venture Blueprint".
    Format the output as a JSON object with the following fields:
    - competitorAnalysis: A brief overview of 2-3 competitors.
    - pitchDeckKeyPoints: 3 key slides/points for a pitch.
    - financialModel: A high-level 12-month revenue projection summary.
    - mvpOutline: 3-4 core features for an MVP.
    
    Return ONLY valid JSON. No markdown formatting.
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: systemInstruction + "\n\nUser Idea: " + prompt }] }]
    });

    const text = result.text;
    
    // Attempt to parse JSON from the response, handling potential markdown blocks
    const cleanText = text.replace(/```json|```/g, "").trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Could not parse AI response as JSON");
  } catch (e: any) {
    console.error("AI Response error:", e);
    return {
      error: e.message || "Generation Failed",
      competitorAnalysis: "The AI failed to generate a response. This might be due to safety filters or service availability.",
      pitchDeckKeyPoints: ["Please try a different idea or try again later."],
      financialModel: "Generation error.",
      mvpOutline: ["Try again."]
    };
  }
};
