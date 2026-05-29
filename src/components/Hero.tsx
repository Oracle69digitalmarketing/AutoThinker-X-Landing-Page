import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onBetaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBetaClick }) => {
  return (
    <section className="relative pt-12 pb-24 grid lg:grid-cols-2 gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-500 mb-6">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
          <span>Venture Architect Beta now open</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8">
          Turn startup ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">execution-ready ventures.</span>
        </h1>
        
        <p className="text-xl text-neutral-400 max-w-xl mb-12 leading-relaxed">
          AutoThinker X uses agent-native systems to generate business architecture, execution workflows, GTM strategy, and deployment intelligence from a single concept.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button 
            onClick={onBetaClick}
            className="group relative px-8 py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-500 transition-all flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-orange-600/20"
          >
            <span>Apply for Early Access</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
          </button>
          
          <button 
            onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-neutral-900 border border-neutral-800 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span>Try Demo</span>
          </button>
        </div>

        <div className="flex items-center gap-6 text-sm text-neutral-500">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-neutral-950 bg-neutral-800 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
              </div>
            ))}
          </div>
          <p>Joined by 500+ founders this week</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative lg:block hidden"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500 to-blue-600 rounded-[2.1rem] blur opacity-30" />
        <div className="relative bg-neutral-900 border border-neutral-800 p-2 rounded-[2rem] overflow-hidden">
          <img 
            src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" 
            alt="AutoThinker X Dashboard" 
            className="rounded-[1.8rem] w-full"
          />
        </div>
      </motion.div>
    </section>
  );
};
