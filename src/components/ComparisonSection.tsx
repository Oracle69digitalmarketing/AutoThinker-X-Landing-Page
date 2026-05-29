import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const tools = [
    { name: "ChatGPT", features: [true, false, false, false] },
    { name: "Lovable", features: [true, "Partial", "Partial", false] },
    { name: "AutoThinker X", features: [true, true, true, true], highlight: true }
  ];

  const featureLabels = [
    "Conversational AI",
    "Workflow Automation",
    "Execution Architecture",
    "Venture Intelligence"
  ];

  return (
    <section className="py-24 border-t border-neutral-900">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for outcomes, not just output.</h2>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Unlike generic LLMs, AutoThinker X is a specialized intelligence layer designed specifically for the lifecycle of a venture.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-6 text-left text-neutral-500 font-medium uppercase tracking-wider text-xs border-b border-neutral-900">Tool</th>
              {featureLabels.map((label, i) => (
                <th key={i} className="p-6 text-center text-neutral-500 font-medium uppercase tracking-wider text-xs border-b border-neutral-900">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tools.map((tool, i) => (
              <tr 
                key={i} 
                className={`${tool.highlight ? 'bg-orange-500/5' : ''} transition-colors group`}
              >
                <td className="p-6 font-bold text-neutral-200 border-b border-neutral-900">
                  {tool.name}
                  {tool.highlight && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-500 text-[10px] text-white uppercase tracking-widest">Selected</span>
                  )}
                </td>
                {tool.features.map((feature, j) => (
                  <td key={j} className="p-6 text-center border-b border-neutral-900">
                    <div className="flex justify-center items-center">
                      {feature === true ? (
                        <div className={`w-8 h-8 rounded-full ${tool.highlight ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/10 text-green-500'} flex items-center justify-center`}>
                          <Check size={16} />
                        </div>
                      ) : feature === false ? (
                        <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                          <X size={16} />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{feature}</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
