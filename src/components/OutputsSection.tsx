import React from 'react';
import { motion } from 'motion/react';
import { FileText, Map as MapIcon, Database, BarChart3, Globe, Code } from 'lucide-react';

export const OutputsSection: React.FC = () => {
  const outputs = [
    { title: "Venture Structures", icon: <Database />, color: "text-blue-500" },
    { title: "Execution Maps", icon: <MapIcon />, color: "text-purple-500" },
    { title: "Roadmap Outputs", icon: <BarChart3 />, color: "text-green-500" },
    { title: "Architecture Docs", icon: <FileText />, color: "text-orange-500" },
    { title: "Financial Models", icon: <Globe />, color: "text-red-500" },
    { title: "GTM Systems", icon: <Code />, color: "text-cyan-500" }
  ];

  return (
    <section className="py-24 border-t border-neutral-900">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="lg:w-1/2">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
            Institutional-grade <span className="text-orange-500">outputs</span> for every stage.
          </h2>
          <p className="text-neutral-400 text-lg mb-12">
            We don't just chat. We architect. AutoThinker X generates the precise technical and business documentation required to secure investment and scale operations.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {outputs.map((output, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800"
              >
                <div className={`${output.color}`}>
                  {React.cloneElement(output.icon as React.ReactElement, { size: 20 })}
                </div>
                <span className="text-sm font-medium text-neutral-300">{output.title}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2 relative">
          <div className="absolute -inset-4 bg-orange-500/10 rounded-[2.5rem] blur-2xl" />
          <div className="relative aspect-video bg-neutral-900 border border-neutral-800 rounded-[2rem] overflow-hidden shadow-2xl">
            {/* Placeholder for real screenshots - using a stylized mock */}
            <div className="absolute inset-0 p-8 flex flex-col gap-4">
              <div className="h-8 w-1/3 bg-neutral-800 rounded-lg animate-pulse" />
              <div className="grid grid-cols-3 gap-4 flex-1">
                <div className="col-span-2 bg-neutral-800/50 rounded-xl border border-white/5" />
                <div className="bg-neutral-800/50 rounded-xl border border-white/5" />
                <div className="bg-neutral-800/50 rounded-xl border border-white/5" />
                <div className="col-span-2 bg-neutral-800/50 rounded-xl border border-white/5" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-center">
              <span className="px-4 py-2 rounded-full bg-orange-500/20 text-orange-500 text-xs font-bold border border-orange-500/30 backdrop-blur-md">
                Actual System Output Previews
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
