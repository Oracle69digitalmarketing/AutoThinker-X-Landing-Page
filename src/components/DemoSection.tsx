import React, { useState, memo, useRef } from 'react';
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
  AlertCircle,
  Copy,
  Download,
  Check
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { generateBlueprint, hasValidKey } from '../lib/ai-provider';

// Helper to safely ensure we have an array for rendering
const safeList = (data: any): string[] => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string' && data.length > 0) return [data];
  if (data && typeof data === 'object') {
    return Object.values(data).map(v => typeof v === 'object' ? JSON.stringify(v) : String(v));
  }
  return [];
};

// Helper to safely render text content with professional formatting
const safeRender = (data: any): string => {
  if (data === null || data === undefined) return "";
  
  // Handle basic types
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return String(data);
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => typeof item === 'object' ? JSON.stringify(item) : String(item)).join(", ");
  }

  // Handle objects with professional formatting
  if (typeof data === 'object') {
    try {
      return Object.entries(data)
        .map(([key, value]) => {
          // Format the Key: camelCase -> Title Case
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();

          // Format the Value based on the key name
          let formattedValue = value;
          
          if (typeof value === 'number') {
            if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('growth') || value < 1 && value > 0) {
              // Format as percentage if it looks like a rate
              formattedValue = `${(value * 100).toFixed(1)}%`;
            } else if (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('price') || key.toLowerCase().includes('projection')) {
              // Format as currency if it looks like money
              formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
            } else {
              formattedValue = new Intl.NumberFormat('en-US').format(value);
            }
          }

          return `${formattedKey}: ${formattedValue}`;
        })
        .join(" | ");
    } catch (e) {
      return JSON.stringify(data);
    }
  }
  return String(data);
};

// Memoize the Blueprint Result to prevent unnecessary re-renders
const BlueprintResult = memo(({ blueprint, onClear }: { blueprint: any, onClear: () => void }) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!blueprint) return null;

  const handleCopy = () => {
    const text = `
AUTOTHINKER X - VENTURE BLUEPRINT
---------------------------------
COMPETITOR ANALYSIS:
${safeRender(blueprint.competitorAnalysis)}

PITCH DECK KEY POINTS:
${safeList(blueprint.pitchDeckKeyPoints).map(p => `- ${safeRender(p)}`).join('\n')}

FINANCIAL MODEL:
${safeRender(blueprint.financialModel)}

MVP ROADMAP:
${safeList(blueprint.mvpOutline).map(p => `- ${safeRender(p)}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`autothinker-blueprint-${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Analysis Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all group relative"
            title="Copy to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all disabled:opacity-50"
            title="Download PDF"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div 
        ref={printRef}
        className="bg-neutral-950 border border-neutral-800 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 space-y-12">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-900 pb-8">
            <div>
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Venture OS Blueprint</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Strategy Architecture</h3>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <p className="text-[10px] text-neutral-700">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid gap-10">
            {/* Competitors */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-neutral-200 uppercase text-xs tracking-[0.2em]">Market Intelligence</h4>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed pl-14">
                {safeRender(blueprint.competitorAnalysis) || "No analysis generated."}
              </p>
            </div>

            {/* Pitch Deck */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <Presentation className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-neutral-200 uppercase text-xs tracking-[0.2em]">Narrative Strategy</h4>
              </div>
              <div className="grid gap-3 pl-14">
                {safeList(blueprint.pitchDeckKeyPoints).map((point, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-orange-500/20 transition-colors">
                    <div className="w-5 h-5 rounded-lg bg-orange-500/10 flex items-center justify-center text-[10px] font-bold text-orange-500 flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-neutral-400">{safeRender(point)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-neutral-200 uppercase text-xs tracking-[0.2em]">Fiscal Projections</h4>
              </div>
              <div className="pl-14">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
                  <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                    {safeRender(blueprint.financialModel) || "No model generated."}
                  </p>
                </div>
              </div>
            </div>

            {/* MVP Roadmap */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-neutral-200 uppercase text-xs tracking-[0.2em]">Execution Roadmap</h4>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pl-14">
                {safeList(blueprint.mvpOutline).map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <p className="text-xs text-neutral-400">{safeRender(item)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-neutral-900 text-center">
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold">Generated by AutoThinker X AI Engine</p>
          </div>
        </div>
      </div>

      <button
        onClick={onClear}
        className="w-full py-4 border border-neutral-900 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 hover:text-white hover:bg-white/5 hover:border-neutral-800 transition-all"
      >
        Discard and Reset Engine
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
