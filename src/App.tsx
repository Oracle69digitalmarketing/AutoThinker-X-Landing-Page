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
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import DemoSection from './components/DemoSection';
import AdminDashboard from './components/AdminDashboard';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { ProcessFlow } from './components/ProcessFlow';
import { OutputsSection } from './components/OutputsSection';
import { ComparisonSection } from './components/ComparisonSection';

export default function App() {
  const [view, setView] = useState<'landing' | 'admin'>('landing');

  // Runtime initializer for Supabase
  const getSupabaseClient = (): SupabaseClient | null => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) return null;
    try {
      return createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.error('Supabase initialization error:', e);
      return null;
    }
  };

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
    userType: 'founder' as 'founder' | 'accelerator'
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (view === 'admin') {
    return <AdminDashboard />;
  }

  const handleBlueprintView = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const demoElement = document.getElementById('demo-section');
      if (demoElement) {
        demoElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Caught blueprint routing exception safely:", error);
      window.location.hash = "#top";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.email) return;

    setStatus('loading');
    setErrorMessage('');
    
    // Initialize the client safely only when the user clicks the button
    const supabase = getSupabaseClient();

    if (!supabase) {
      setStatus('error');
      setErrorMessage('Configuration error: Connection tokens are not accessible.');
      return;
    }

    try {
      // 1. Save to Supabase (Free Tier)
      const { error: supabaseError } = await supabase
        .from('waitlist')
        .insert([
          { 
            name: formState.name || 'Anonymous',
            email: formState.email.trim().toLowerCase(),
            wtp: formState.wtp,
            excited_feature: formState.excitedFeature,
            user_type: formState.userType,
            created_at: new Date().toISOString()
          }
        ]);

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          throw new Error('This email is already registered on our waitlist.');
        }
        throw supabaseError;
      }

      // 2. Trigger Email Delivery via Vercel API Route (Free)
      try {
        await fetch('/api/send-lead-magnet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formState.email,
            name: formState.name
          }),
        });
      } catch (emailErr) {
        console.warn('Email trigger failed, but user was added to database:', emailErr);
      }

      setStatus('success');
      setFormState({ ...formState, email: '' });
    } catch (error: any) {
      console.error('Error in submission: ', error);
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
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

      <div className="max-w-7xl mx-auto px-6">
        <Hero onBetaClick={() => document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' })} />
        
        <ProblemSection />
        
        <ProcessFlow />

        {/* Waitlist/Beta Access Form Section */}
        <section id="waitlist-section" className="py-24 border-t border-neutral-900 grid lg:grid-cols-2 gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Join the <span className="text-orange-500 text-glow">Founder Beta</span></h2>
            <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
              We're opening access to a select group of founders and ecosystem builders. Secure your spot to shape the future of venture architecture.
            </p>
            
            <div className="space-y-6">
              {[
                { title: "Priority Support", desc: "Direct access to the founding team for venture strategy." },
                { title: "Lifetime Discount", desc: "40% off all future premium features for beta members." },
                { title: "Custom Architecture", desc: "Request specific agent modules tailored to your industry." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-200">{item.title}</h4>
                    <p className="text-sm text-neutral-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
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
                    <h2 className="text-2xl font-bold mb-4">🚀 Application Received!</h2>
                    <p className="text-neutral-400 mb-8 text-sm">
                      Check your inbox for your AfCFTA Cross-Border Expansion Checklist. We'll review your application for beta access shortly.
                    </p>
                    <div className="flex flex-col gap-4">
                      <button 
                        onClick={handleBlueprintView}
                        className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-500 transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Try Demo Engine</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="form">
                    <h2 className="text-2xl font-bold mb-2">Request Beta Access</h2>
                    <p className="text-neutral-400 mb-8 text-sm leading-relaxed">
                      Join 500+ founders. Get our AI-generated <span className="text-orange-500 font-medium">'2026 AfCFTA Expansion Checklist'</span> instantly.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* User Type Toggle */}
                      <div className="flex gap-4 p-1 bg-neutral-950 border border-neutral-800 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setFormState({...formState, userType: 'founder'})}
                          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                            formState.userType === 'founder' 
                              ? 'bg-neutral-800 text-white shadow-sm' 
                              : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          Founder
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormState({...formState, userType: 'accelerator'})}
                          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                            formState.userType === 'accelerator' 
                              ? 'bg-neutral-800 text-white shadow-sm' 
                              : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          Accelerator
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Name</label>
                        <input 
                          type="text"
                          value={formState.name}
                          onChange={(e) => setFormState({...formState, name: e.target.value})}
                          placeholder="Your Name"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Work Email</label>
                        <input 
                          required
                          type="email"
                          value={formState.email}
                          onChange={(e) => setFormState({...formState, email: e.target.value})}
                          placeholder="you@company.com"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                          Primary Interest?
                        </label>
                        <div className="relative">
                          <select 
                            value={formState.excitedFeature}
                            onChange={(e) => setFormState({...formState, excitedFeature: e.target.value})}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all text-sm appearance-none cursor-pointer"
                          >
                            <option value="">Select interest</option>
                            <option value="Competitor analysis">Competitor analysis</option>
                            <option value="Architecture Design">Architecture Design</option>
                            <option value="Financial Modeling">Financial Modeling</option>
                            <option value="GTM Execution">GTM Execution</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                            <ChevronRight className="w-4 h-4 rotate-90" />
                          </div>
                        </div>
                      </div>

                      {status === 'error' && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <p className="flex-1 opacity-90">{errorMessage}</p>
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
                            <span>Request Beta Access</span>
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
        </section>

        <OutputsSection />
        
        <ComparisonSection />

        <DemoSection />
      </div>

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
