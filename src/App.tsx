import React, { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Target, 
  Map, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Shield
} from 'lucide-react';
import { db } from './lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import DemoSection from './components/DemoSection';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [view, setView] = useState<'landing' | 'admin'>('landing');

  // Simple hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setView('admin');
      } else {
        setView('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    wtp: '',
    excitedFeature: '',
    userType: 'individual'
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (view === 'admin') {
    return <AdminDashboard />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await addDoc(collection(db, 'waitlist_entries'), {
        ...formState,
        name: formState.name || 'Anonymous',
        createdAt: serverTimestamp(),
      });
      setStatus('success');
    } catch (error) {
      console.error('Error adding document: ', error);
      setStatus('error');
    }
  };

  const LegalModal = ({ title, content, isOpen, onClose }: { title: string, content: React.ReactNode, isOpen: boolean, onClose: () => void }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2rem] max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <Target className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="text-neutral-400 text-sm leading-relaxed space-y-4">
              {content}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-orange-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <LegalModal 
        title="Privacy Policy"
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        content={
          <>
            <p><strong>Last Updated: May 20, 2026</strong></p>
            <p>At AutoThinker X, we take your privacy seriously. This policy explains how we handle your data.</p>
            <h4 className="font-bold text-white mt-4">1. Information We Collect</h4>
            <p>We only collect the information you voluntarily provide through our waitlist form: name, email address, and product preferences.</p>
            <h4 className="font-bold text-white mt-4">2. How We Use Data</h4>
            <p>Your information is used strictly to provide beta access updates, personalized product notifications, and to improve the AutoThinker X experience.</p>
            <h4 className="font-bold text-white mt-4">3. Data Protection</h4>
            <p>We do not sell, trade, or share your personal data with third parties for marketing purposes. All data is stored securely via Firebase (Google Cloud Infrastructure).</p>
            <h4 className="font-bold text-white mt-4">4. Your Rights</h4>
            <p>You can request to be removed from our waitlist or have your data deleted at any time by contacting us through our social media channels.</p>
          </>
        }
      />

      <LegalModal 
        title="Terms of Service"
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        content={
          <>
            <p><strong>Last Updated: May 20, 2026</strong></p>
            <p>By joining the AutoThinker X beta waitlist, you agree to the following terms:</p>
            <h4 className="font-bold text-white mt-4">1. Beta Access</h4>
            <p>AutoThinker X is currently in private beta. Access is granted at our discretion and the service is provided "as is" without warranties of any kind.</p>
            <h4 className="font-bold text-white mt-4">2. Intellectual Property</h4>
            <p>Your product ideas and business data remain your property. AutoThinker X does not claim ownership over any blueprints generated using our tool.</p>
            <h4 className="font-bold text-white mt-4">3. User Conduct</h4>
            <p>You agree not to use AutoThinker X for any unlawful purposes or to generate malicious content.</p>
            <h4 className="font-bold text-white mt-4">4. Limitation of Liability</h4>
            <p>We are not liable for any business decisions made based on AI-generated blueprints. The tool is designed to assist in strategy, not replace professional legal or financial advice.</p>
          </>
        }
      />

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
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
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
                  <span className="font-bold text-neutral-200">{prop.title}:</span>{" "}
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
                  <p className="text-neutral-400 mb-8 text-sm leading-relaxed">
                    Join the waitlist today and get our AI-generated <span className="text-orange-500 font-medium">'2026 AfCFTA Cross-Border Expansion Checklist'</span> sent instantly to your inbox.
                  </p>

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

                    <div className="space-y-3">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">I am joining as:</label>
                      <div className="grid grid-cols-1 gap-3">
                        <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formState.userType === 'individual' ? 'bg-orange-500/10 border-orange-500/50' : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'}`}>
                          <input 
                            type="radio" 
                            name="userType" 
                            className="hidden" 
                            checked={formState.userType === 'individual'}
                            onChange={() => setFormState({...formState, userType: 'individual'})}
                          />
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formState.userType === 'individual' ? 'border-orange-500' : 'border-neutral-700'}`}>
                            {formState.userType === 'individual' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                          </div>
                          <span className="text-sm text-neutral-300">Individual Founder</span>
                        </label>
                        <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formState.userType === 'incubator' ? 'bg-orange-500/10 border-orange-500/50' : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'}`}>
                          <input 
                            type="radio" 
                            name="userType" 
                            className="hidden" 
                            checked={formState.userType === 'incubator'}
                            onChange={() => setFormState({...formState, userType: 'incubator'})}
                          />
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formState.userType === 'incubator' ? 'border-orange-500' : 'border-neutral-700'}`}>
                            {formState.userType === 'incubator' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                          </div>
                          <span className="text-sm text-neutral-300">Incubator/Accelerator Hub</span>
                        </label>
                      </div>
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
                          <option value="$0 – I'd only use free">$0 – I'd only use free</option>
                          <option value="$1‑$5 per blueprint">$1‑$5 per blueprint</option>
                          <option value="$6‑$10 per blueprint">$6‑$10 per blueprint</option>
                          <option value="$11‑$15 per month (unlimited)">$11‑$15 per month (unlimited)</option>
                          <option value="$20+ per month">$20+ per month</option>
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
                    <p className="text-center text-[10px] text-neutral-500 mt-4 flex items-center justify-center gap-1.5 uppercase tracking-widest font-medium">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                      ⚡ Joining 100+ African tech founders and ecosystem builders.
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <DemoSection />

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
          <a href="#admin" className="hover:text-neutral-400 transition-colors flex items-center gap-1 group">
            <Shield className="w-3 h-3 group-hover:text-orange-500 transition-colors" />
            <span>Admin Portal</span>
          </a>
          <button onClick={() => setShowPrivacy(true)} className="hover:text-neutral-400 transition-colors uppercase">Privacy Policy</button>
          <button onClick={() => setShowTerms(true)} className="hover:text-neutral-400 transition-colors uppercase">Terms of Service</button>
          <a href="https://x.com/sophiemabel69" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">Twitter</a>
          <a href="https://www.linkedin.com/in/oracle69digitalmarketing" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">LinkedIn</a>
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
