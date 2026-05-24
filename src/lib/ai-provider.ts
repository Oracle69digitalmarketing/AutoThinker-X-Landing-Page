import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

// Helper to get environment variables across different platforms
const getEnv = (key: string) => {
  // Try Vite's import.meta.env first (with and without VITE_ prefix)
  const viteKey = key.startsWith('VITE_') ? key : `VITE_${key}`;
  const rawKey = key.startsWith('VITE_') ? key.replace('VITE_', '') : key;

  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env[viteKey]) return import.meta.env[viteKey];
    if (import.meta.env[rawKey]) return import.meta.env[rawKey];
  }

  // Fallback to global process.env
  try {
    const procEnv = (globalThis as any).process?.env;
    if (procEnv) {
      if (procEnv[viteKey]) return procEnv[viteKey];
      if (procEnv[rawKey]) return procEnv[rawKey];
    }
  } catch {
    // Ignore process errors
  }
  
  return "";
};

const GEMINI_KEY = getEnv('GEMINI_API_KEY');
const GROQ_KEY = getEnv('GROQ_API_KEY');

export const hasValidKey = () => {
  const hasGemini = typeof GEMINI_KEY === 'string' && GEMINI_KEY.length > 10;
  const hasGroq = typeof GROQ_KEY === 'string' && GROQ_KEY.length > 10;
  return hasGemini || hasGroq;
};

const SYSTEM_INSTRUCTION = `
  You are AutoThinker X, an expert AI product strategist. 
  Based on the user's business idea, generate a concise "Venture Blueprint".
  Format the output as a JSON object with the following fields:
  - competitorAnalysis: A brief overview of 2-3 competitors.
  - pitchDeckKeyPoints: An array of 3 strings for key slides/points for a pitch.
  - financialModel: A high-level 12-month revenue projection summary.
  - mvpOutline: An array of 3-4 core features for an MVP.
  
  Return ONLY valid JSON. No markdown formatting.
`;

export const generateBlueprint = async (prompt: string) => {
  if (!hasValidKey()) {
    throw new Error("API Keys are missing. Please set VITE_GEMINI_API_KEY or VITE_GROQ_API_KEY in your environment.");
  }

  // 1. Attempt Groq (Ultra-fast Llama 3)
  if (typeof GROQ_KEY === 'string' && GROQ_KEY.length > 10) {
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
      if (!(typeof GEMINI_KEY === 'string' && GEMINI_KEY.length > 10)) {
        throw new Error(`Groq Error: ${e.message}`);
      }
    }
  }

  // 2. Fallback to Gemini 2.0 Flash
  if (typeof GEMINI_KEY === 'string' && GEMINI_KEY.length > 10) {
    try {
      console.log("ai-provider: Initializing Gemini...");
      const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      console.log("ai-provider: Requesting content from Gemini...");
      const result = await model.generateContent(SYSTEM_INSTRUCTION + "\n\nUser Idea: " + prompt);
      const response = await result.response;
      const text = response.text();

      console.log("ai-provider: Gemini response received. Length:", text.length);

      if (!text) throw new Error("AI returned an empty response.");

      const cleanText = text.replace(/```json|```/g, "").trim();
      console.log("ai-provider: Cleaned text sample:", cleanText.substring(0, 100));
      
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log("ai-provider: JSON parsed successfully.");
          return parsed;
        } catch (parseErr) {
          console.error("ai-provider: JSON parse error:", parseErr);
          throw new Error("Failed to parse AI response as JSON.");
        }
      }
      
      console.warn("ai-provider: No JSON found in response. Using fallback.");
      // Fallback for non-JSON responses
      return {
        competitorAnalysis: "Analysis generated but format was unexpected.",
        pitchDeckKeyPoints: ["Focus on core value prop", "Define target audience", "Plan scalability"],
        financialModel: "Revenue model pending details.",
        mvpOutline: ["User registration", "Core feature demo", "Feedback loop"]
      };
    } catch (e: any) {
      console.error("ai-provider: Gemini failed:", e);
      throw new Error(`AI Service Error: ${e.message || "Unknown error"}`);
    }
  }

  throw new Error("All AI services are currently unavailable.");
};
