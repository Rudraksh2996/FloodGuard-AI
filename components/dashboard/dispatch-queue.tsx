"use client";
import React, { useState } from "react";
import { useNodes } from "@/hooks/use-nodes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const DispatchQueue = () => {
  const { nodes, isLoading } = useNodes();
  const [dispatched, setDispatched] = useState<Record<string, number>>({});

  if (isLoading) return <div className="p-4 animate-pulse">Loading queue...</div>;

  const sortedNodes = [...nodes].sort((a, b) => b.fri.score - a.fri.score);

  const handleDispatch = (id: string, nodeName: string) => {
    setDispatched(prev => ({ ...prev, [id]: Date.now() }));
    import("sonner").then(m => {
      m.toast.success(`Dispatch signal sent to ${nodeName}`, {
        description: "Hydro-Jet truck is en route. System is on 15m cooldown.",
      });
    });
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900/40 border-l border-white/10 w-full md:w-[350px] flex-shrink-0">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-bold">Priority Dispatch</h3>
        <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded">Live Queue</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {sortedNodes.map((node) => {
            const isDispatched = !!dispatched[node.id];
            
            return (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-neutral-950 rounded-xl p-4 border border-white/10 flex flex-col space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-neutral-200">{node.name}</h4>
                    <span className={cn("text-xs px-2 py-0.5 rounded mt-1 inline-block border", node.fri.badgeColor)}>
                      {node.fri.level}
                    </span>
                  </div>
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-10 h-10 transform -rotate-90">
                      <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-neutral-800" />
                      <circle 
                        cx="20" cy="20" r="16" 
                        stroke="currentColor" strokeWidth="4" fill="transparent" 
                        strokeDasharray={100} 
                        strokeDashoffset={100 - (node.fri.score * 100)} 
                        className={node.fri.color}
                      />
                    </svg>
                    <span className="absolute text-[10px] font-mono">{node.fri.score.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="text-xs text-neutral-400 bg-neutral-900 p-2 rounded">
                  {node.drainStatus}
                </div>

                {isDispatched ? (
                  <button disabled className="w-full py-2 bg-neutral-800 text-neutral-500 text-xs rounded font-medium border border-neutral-700 cursor-not-allowed">
                    Dispatch Sent (15m cooldown)
                  </button>
                ) : node.fri.score > 0.65 ? (
                  <button onClick={() => handleDispatch(node.id, node.name)} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded font-medium transition-colors active:scale-[0.98]">
                    Dispatch Hydro-Jet
                  </button>
                ) : null}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
