import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  BarChart3, 
  Presentation, 
  Layers, 
  Loader2, 
  ChevronRight,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import { generateBlueprint, hasValidKey } from '../lib/ai-provider';

// Helper to safely ensure we have an array for rendering
const safeList = (data: any): string[] => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string' && data.length > 0) return [data];
  if (data && typeof data === 'object') {
    // If it's an object, try to extract values or stringify
    return Object.values(data).map(v => typeof v === 'object' ? JSON.stringify(v) : String(v));
  }
  return [];
};

// Helper to safely render text content (prevents React Error #31)
const safeRender = (data: any): React.ReactNode => {
  if (data === null || data === undefined) return "";
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return String(data);
  }
  if (Array.isArray(data)) {
    return data.map(item => typeof item === 'object' ? JSON.stringify(item) : String(item)).join(", ");
  }
  if (typeof data === 'object') {
    // If it's a simple object, stringify its values or keys
    try {
      return Object.entries(data)
        .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
        .join(" | ");
    } catch (e) {
      return JSON.stringify(data);
    }
  }
  return String(data);
};

// Memoize the Blueprint Result to prevent unnecessary re-renders
const BlueprintResult = memo(({ blueprint, onClear }: { blueprint: any, onClear: () => void }) => {
  if (!blueprint) return null;
  
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 lg:p-10 shadow-2xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <Sparkles className="w-32 h-32 text-orange-500" />
      </div>

      <div className="space-y-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Search className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-200 mb-1 uppercase text-xs tracking-widest">Competitor Analysis</h4>
            <div className="text-sm text-neutral-400 leading-relaxed">{safeRender(blueprint.competitorAnalysis) || "No analysis generated."}</div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <Presentation className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-200 mb-1 uppercase text-xs tracking-widest">Pitch Deck Keys</h4>
            <ul className="grid gap-2">
              {safeList(blueprint.pitchDeckKeyPoints).map((point: string, i: number) => (
                <li key={i} className="text-sm text-neutral-400 flex items-center gap-2">
                  <div className="w-1 h-1 bg-orange-500 rounded-full" />
                  {safeRender(point)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-200 mb-1 uppercase text-xs tracking-widest">Financial Model</h4>
            <div className="text-sm text-neutral-400 leading-relaxed">{safeRender(blueprint.financialModel) || "No model generated."}</div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-200 mb-1 uppercase text-xs tracking-widest">MVP Roadmap</h4>
            <ul className="grid gap-2">
              {safeList(blueprint.mvpOutline).map((item: string, i: number) => (
                <li key={i} className="text-sm text-neutral-400 flex items-center gap-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full" />
                  {safeRender(item)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={onClear}
        className="mt-10 w-full py-3 border border-neutral-800 rounded-xl text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white hover:bg-white/5 transition-all"
      >
        Clear and Start Over
      </button>
    </motion.div>
  );
});

export default function DemoSection() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    console.log("DemoSection: Starting generation for input:", input);
    setIsLoading(true);
    setError(null);
    setBlueprint(null);
    
    try {
      console.log("DemoSection: Checking API keys...");
      const keyStatus = hasValidKey();
      console.log("DemoSection: API Key Status:", keyStatus);

      if (!keyStatus) {
        throw new Error("API Keys are not configured. Please ensure VITE_GEMINI_API_KEY is set in Vercel settings.");
      }

      console.log("DemoSection: Calling generateBlueprint...");
      const result = await generateBlueprint(input);
      
      if (!result || typeof result !== 'object') {
        console.error("DemoSection: Invalid result received:", result);
        throw new Error("The AI returned an invalid response format.");
      }

      console.log("DemoSection: Generation successful. Data structure:", Object.keys(result));
      setBlueprint(result);
    } catch (err: any) {
      console.error("DemoSection Critical Error:", err);
      // Ensure we set a user-friendly error string
      setError(err.message || "A critical error occurred. Please check the console for details.");
    } finally {
      console.log("DemoSection: Finishing loading state.");
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setBlueprint(null);
    setError(null);
  };

  return (
    <section id="demo-section" className="max-w-7xl mx-auto px-6 py-24 border-t border-neutral-900">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            See it in <span className="text-orange-500">Action</span>
          </h2>
          <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
            Experience how AutoThinker X transforms a raw idea into a structured strategy. Describe your project in a few words and let our agents go to work.
          </p>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., A subscription-based platform for urban indoor farming using IoT..."
                className="w-full h-32 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all text-neutral-100 placeholder:text-neutral-600 resize-none"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold">Press Generate</span>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold mb-1">Generation Failed</p>
                  <p className="opacity-90">{error}</p>
                </div>
              </div>
            )}

            <button
              disabled={isLoading || !input.trim()}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI is thinking...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Free Blueprint</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-xs text-neutral-500 font-medium">
            <span className="flex items-center gap-1"><RefreshCcw className="w-3 h-3" /> No login required</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Dual AI Engine (Groq + Gemini)</span>
          </div>
        </div>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="absolute inset-0 bg-neutral-900/50 border border-neutral-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Analyzing your idea...</h3>
                <p className="text-neutral-500 text-sm max-w-xs">
                  Our agents are researching competitors and building your financial model.
                </p>
              </motion.div>
            ) : blueprint ? (
              <BlueprintResult blueprint={blueprint} onClear={handleClear} />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-neutral-900/30 border border-neutral-800 border-dashed rounded-3xl flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 text-neutral-700">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-500 mb-2">Waiting for your idea...</h3>
                <p className="text-neutral-600 text-sm max-w-xs">
                  Your generated blueprint will appear here in seconds.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
