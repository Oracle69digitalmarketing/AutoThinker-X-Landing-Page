import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

// Helper to get environment variables across different platforms
const getEnv = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return (globalThis as any).process?.env?.[key] || "";
};

const GEMINI_KEY = getEnv('VITE_GEMINI_API_KEY');
const GROQ_KEY = getEnv('VITE_GROQ_API_KEY');

// Initialize Gemini (using the NEW @google/genai client)
const ai = GEMINI_KEY ? new GoogleGenAI({ apiKey: GEMINI_KEY }) : null;

// Initialize Groq
const groq = GROQ_KEY ? new Groq({ apiKey: GROQ_KEY, dangerouslyAllowBrowser: true }) : null;

export const hasValidKey = () => (GEMINI_KEY && GEMINI_KEY.length > 10) || (GROQ_KEY && GROQ_KEY.length > 10);

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

/**
 * Strategy: Try Groq first for ultra-fast response, fallback to Gemini 2.0 Flash
 */
export const generateBlueprint = async (prompt: string) => {
  if (!hasValidKey()) {
    throw new Error("No AI providers configured. Please set VITE_GEMINI_API_KEY or VITE_GROQ_API_KEY.");
  }

  // 1. Attempt Groq (Ultra-fast Llama 3)
  if (groq) {
    try {
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
    } catch (e) {
      console.warn("Groq failed, falling back to Gemini:", e);
    }
  }

  // 2. Fallback to Gemini 2.0 Flash (Reliable & Multi-modal capable)
  if (ai) {
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: SYSTEM_INSTRUCTION + "\n\nUser Idea: " + prompt }] }]
      });

      const text = result.text;
      const cleanText = text.replace(/```json|```/g, "").trim();
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Gemini also failed:", e);
    }
  }

  throw new Error("All AI providers failed to generate a response.");
};
