import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Layers, Zap, Clock } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: <Layers className="w-6 h-6 text-orange-500" />,
      title: "Fragmented Ecosystem",
      description: "Founders juggle 15+ tools just to define a product. Strategy is scattered across docs, sheets, and chats."
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      title: "Execution Complexity",
      description: "90% of startups fail not because of bad ideas, but because they can't bridge the gap between concept and operation."
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: "Operational Chaos",
      description: "Ideas die in the 'valley of death' while founders struggle with GTM, tech architecture, and financial modeling."
    }
  ];

  return (
    <section className="py-24 border-t border-neutral-900">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Why most ventures fail before they start.</h2>
        <p className="text-neutral-400 text-lg">
          The traditional way of building is slow, expensive, and fragmented. Founders spend more time managing complexity than building value.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {problems.map((problem, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 hover:border-orange-500/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {problem.icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{problem.title}</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              {problem.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
