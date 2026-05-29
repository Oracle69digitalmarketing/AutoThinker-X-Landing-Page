import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Layout, GitBranch, Target, Box, Rocket, ChevronRight } from 'lucide-react';

export const ProcessFlow: React.FC = () => {
  const steps = [
    { icon: <Lightbulb />, label: "Idea", color: "from-yellow-500/20 to-yellow-500/5" },
    { icon: <Layout />, label: "Architecture", color: "from-blue-500/20 to-blue-500/5" },
    { icon: <GitBranch />, label: "Execution Plan", color: "from-purple-500/20 to-purple-500/5" },
    { icon: <Target />, label: "GTM", color: "from-red-500/20 to-red-500/5" },
    { icon: <Box />, label: "Product Blueprint", color: "from-green-500/20 to-green-500/5" },
    { icon: <Rocket />, label: "Deployment", color: "from-orange-500/20 to-orange-500/5" }
  ];

  return (
    <section className="py-24 border-t border-neutral-900 overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">The Path to Venture Maturity</h2>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          We bridge the gap between abstract concept and deployed reality through a unified intelligence pipeline.
        </p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent -translate-y-1/2 hidden lg:block" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} border border-white/10 flex items-center justify-center mb-4 relative group`}>
                <div className="text-neutral-200 group-hover:scale-110 transition-transform duration-300">
                  {React.cloneElement(step.icon as React.ReactElement, { size: 32 })}
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-neutral-800 hidden lg:block">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
              <span className="text-sm font-bold text-neutral-300 text-center">{step.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
