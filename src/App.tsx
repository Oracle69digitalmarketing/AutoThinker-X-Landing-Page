import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Target, 
  Map, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function App() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    wtp: '',
    excitedFeature: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Replace the URL below with your actual Google Form link
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';
    
    // Attempt to open in new tab
    window.open(GOOGLE_FORM_URL, '_blank');
    
    // Show success state on the landing page
    setStatus('success');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-orange-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="AutoThinker X Logo" 
            className="h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-2 gap-16 items-start">
        {/* Left Column: Hero Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-orange-500 mb-6">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Product Strategy</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8">
            AutoThinker X – From Idea to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Investable Blueprint</span> in Under 10 Minutes
          </h1>
          
          <p className="text-lg text-neutral-400 max-w-xl mb-12 leading-relaxed">
            Multi‑agent AI that generates competitor analysis, pitch deck, financial model, and MVP outline. Actionable enough for bootstrapped founders.
          </p>

          <div className="space-y-4 mb-12">
            {[
              { title: "Fast", desc: "Go from idea to execution plan in minutes, not months" },
              { title: "Complete", desc: "Pitch deck, financial model, competitor analysis, MVP scope" },
              { title: "Actionable", desc: "Built to be accessible – no expensive consultants needed" }
            ].map((prop, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                </div>
                <div>
                  <span className="font-bold text-neutral-200">✅ {prop.title}:</span>{" "}
                  <span className="text-neutral-400">{prop.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 backdrop-blur-md">
            <p className="text-orange-400 font-medium mb-1 truncate">Special Beta Offer</p>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Be among the first 50 users. Free access during beta, plus <span className="text-white font-bold">40% lifetime discount</span> after launch – as a thank you for shaping the product.
            </p>
          </div>

          {/* How it Works Section */}
          <div className="mt-16 pt-16 border-t border-neutral-900">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              How it Works
            </h3>
            <div className="space-y-8">
              {[
                { step: "01", title: "Describe Idea", text: "Type a few sentences about what you want to build." },
                { step: "02", title: "AI Research", text: "Agents crawl the web for competitors and market trends." },
                { step: "03", title: "Blueprint Gen", text: "Get your deck, roadmap, and model delivered in minutes." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-orange-500/40 font-mono text-sm font-bold pt-1">{item.step}</span>
                  <div>
                    <h4 className="font-semibold text-neutral-200">{item.title}</h4>
                    <p className="text-sm text-neutral-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Waitlist Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative sticky top-8"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500 to-blue-600 rounded-[2.1rem] blur opacity-20" />
          <div className="relative bg-neutral-900 border border-neutral-800 p-8 lg:p-10 rounded-[2rem] shadow-2xl">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">You're on the list!</h2>
                  <p className="text-neutral-400 mb-8">
                    Thanks for joining the AutoThinker X beta. We'll email you as soon as your spot is ready.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-orange-500 font-medium hover:underline"
                  >
                    Back to top
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <h2 className="text-2xl font-bold mb-2">Join Beta Waitlist</h2>
                  <p className="text-neutral-400 mb-8 text-sm">No credit card. We'll email you when your spot is ready.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Name <span className="text-neutral-600 font-normal italic">(Optional)</span>
                      </label>
                      <input 
                        type="text"
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        placeholder="Elon Musk"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Email</label>
                      <input 
                        required
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        placeholder="elon@mars.com"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        What would you feel comfortable paying for a complete venture blueprint?
                      </label>
                      <div className="relative">
                        <select 
                          value={formState.wtp}
                          onChange={(e) => setFormState({...formState, wtp: e.target.value})}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all text-sm appearance-none cursor-pointer"
                        >
                          <option value="">Select an option</option>
                          <option value="$0 – I'd only use a free version">$0 – I'd only use a free version</option>
                          <option value="$1–$5 per blueprint (pay as you go)">$1–$5 per blueprint (pay as you go)</option>
                          <option value="$6–$10 per blueprint">$6–$10 per blueprint</option>
                          <option value="$11–$15 per month (unlimited blueprints)">$11–$15 per month (unlimited blueprints)</option>
                          <option value="$20+ per month (unlimited + priority support)">$20+ per month (unlimited + priority support)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                          <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Which feature excites you most? <span className="text-neutral-600 font-normal italic">(Optional)</span>
                      </label>
                      <div className="relative">
                        <select 
                          value={formState.excitedFeature}
                          onChange={(e) => setFormState({...formState, excitedFeature: e.target.value})}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all text-sm appearance-none cursor-pointer"
                        >
                          <option value="">Select feature</option>
                          <option value="Competitor analysis">Competitor analysis</option>
                          <option value="Pitch deck">Pitch deck</option>
                          <option value="Financial model">Financial model</option>
                          <option value="MVP outline">MVP outline</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                          <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                      </div>
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="flex-1 opacity-90 truncate">
                          Error joining waitlist. Please try again later.
                        </p>
                      </div>
                    )}

                    <button 
                      disabled={status === 'loading'}
                      className="group relative w-full bg-neutral-100 text-neutral-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                      {status === 'loading' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span>Join the Beta – Free</span>
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-neutral-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Trusted by the next generation of founders</h2>
          <p className="text-neutral-500">AutoThinker X is in private beta. Here's what early testers are saying.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              attribution: "Founder, Lagos (early demo user)", 
              text: "The competitor analysis alone saved me days of manual research. I could finally see where my idea fits." 
            },
            { 
              attribution: "Solo founder, Nairobi", 
              text: "Having a pitch deck and financial model generated together is a game changer for someone like me who isn't a finance person." 
            },
            { 
              attribution: "Pre‑seed founder, Cape Town", 
              text: "I used AutoThinker X to validate my idea before approaching an incubator. It gave me confidence and structure." 
            }
          ].map((t, i) => (
            <div key={i} className="p-8 rounded-3xl bg-neutral-900/30 border border-neutral-800 backdrop-blur-sm relative overflow-hidden group">
              <p className="text-neutral-300 italic mb-6 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="text-xs text-orange-500 font-medium uppercase tracking-widest">— {t.attribution}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "Is the data really accurate?", a: "AutoThinker X uses real-time search and specialized financial models to ensure data reflects current market conditions." },
            { q: "What do I get exactly?", a: "You'll receive a downloadable PDF and interactive dashboard containing a Pitch Deck, Financial Model, Competitor Matrix, and MVP Roadmap." },
            { q: "How is my data protected?", a: "Your ideas are your own. We don't use your specific project data to train our global models without explicit permission." }
          ].map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
              <h4 className="font-bold text-neutral-200 mb-2">{faq.q}</h4>
              <p className="text-sm text-neutral-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-neutral-900 mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-neutral-600 text-[10px] uppercase tracking-widest">
        <p>© 2026 AutoThinker X. All rights reserved.</p>
        <div className="flex gap-8">
          <button className="hover:text-neutral-400 transition-colors uppercase cursor-not-allowed">Privacy (Coming Soon)</button>
          <button className="hover:text-neutral-400 transition-colors uppercase cursor-not-allowed">Terms (Coming Soon)</button>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">Twitter</a>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
