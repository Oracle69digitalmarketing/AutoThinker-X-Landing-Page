import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (process.env as any).GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const generateBlueprint = async (prompt: string) => {
  const systemInstruction = `
    You are AutoThinker X, an expert AI product strategist. 
    Based on the user's business idea, generate a concise "Venture Blueprint".
    Format the output as a JSON object with the following fields:
    - competitorAnalysis: A brief overview of 2-3 competitors.
    - pitchDeckKeyPoints: 3 key slides/points for a pitch.
    - financialModel: A high-level 12-month revenue projection summary.
    - mvpOutline: 3-4 core features for an MVP.
    
    Keep it professional, actionable, and concise.
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: systemInstruction + "\n\nUser Idea: " + prompt }] }]
    });

    const text = result.text;
    
    // Attempt to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Could not parse AI response as JSON");
  } catch (e) {
    console.error("AI Response error:", e);
    return {
      competitorAnalysis: "Error generating analysis. Please check your API key.",
      pitchDeckKeyPoints: ["Error generating pitch deck points."],
      financialModel: "Error generating financial model.",
      mvpOutline: ["Error generating MVP outline."]
    };
  }
};
