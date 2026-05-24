import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

// Helper to get environment variables across different platforms
const getEnv = (key: string) => {
  // Try Vite's import.meta.env first
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  // Fallback to global process.env (for SSR or certain production builds)
  try {
    return (globalThis as any).process?.env?.[key] || "";
  } catch {
    return "";
  }
};

const GEMINI_KEY = getEnv('VITE_GEMINI_API_KEY');
const GROQ_KEY = getEnv('VITE_GROQ_API_KEY');

export const hasValidKey = () => {
  const hasGemini = !!GEMINI_KEY && GEMINI_KEY.length > 10;
  const hasGroq = !!GROQ_KEY && GROQ_KEY.length > 10;
  return hasGemini || hasGroq;
};

const SYSTEM_INSTRUCTION = `
  You are AutoThinker X, an expert AI product strategist. 
  Based on the user's business idea, generate a concise "Venture Blueprint".
  Format the output as a JSON object with the following fields:
  - competitorAnalysis: A brief overview of 2-3 competitors.
  - pitchDeckKeyPoints: 3 key slides/points for a pitch.
  - financialModel: A high-level 12-month revenue projection summary.
  - mvpOutline: 3-4 core features for an MVP.
  
  Return ONLY valid JSON. No markdown formatting.
`;

export const generateBlueprint = async (prompt: string) => {
  if (!hasValidKey()) {
    throw new Error("API Keys are missing. Please set VITE_GEMINI_API_KEY or VITE_GROQ_API_KEY in your dashboard.");
  }

  // 1. Attempt Groq (Ultra-fast Llama 3)
  if (GROQ_KEY && GROQ_KEY.length > 10) {
    try {
      const groq = new Groq({ apiKey: GROQ_KEY, dangerouslyAllowBrowser: true });
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (content) return JSON.parse(content);
    } catch (e: any) {
      console.warn("Groq failed:", e.message);
      // If Groq is the only key and it fails, re-throw to be caught by UI
      if (!(GEMINI_KEY && GEMINI_KEY.length > 10)) {
        throw new Error(`Groq Error: ${e.message}`);
      }
    }
  }

  // 2. Fallback to Gemini 2.0 Flash
  if (GEMINI_KEY && GEMINI_KEY.length > 10) {
    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: SYSTEM_INSTRUCTION + "\n\nUser Idea: " + prompt }] }]
      });

      const text = result.text;
      const cleanText = text.replace(/```json|```/g, "").trim();
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      
      // Fallback for non-JSON responses
      return {
        competitorAnalysis: "Analysis generated but format was unexpected.",
        pitchDeckKeyPoints: ["Focus on core value prop", "Define target audience", "Plan scalability"],
        financialModel: "Revenue model pending details.",
        mvpOutline: ["User registration", "Core feature demo", "Feedback loop"]
      };
    } catch (e: any) {
      console.error("Gemini failed:", e.message);
      throw new Error(`AI Error: ${e.message}`);
    }
  }

  throw new Error("All AI services are currently unavailable.");
};
