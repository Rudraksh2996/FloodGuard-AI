"use client";
import React from "react";
import { EvaluatedNode, WeatherData } from "@/store/simulator-store";
import { X, CloudRain, Wind, Droplets, Thermometer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const NodeDrawer = ({ 
  node, 
  weather, 
  onClose 
}: { 
  node: EvaluatedNode | null, 
  weather?: WeatherData, 
  onClose: () => void 
}) => {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 w-80 h-full bg-neutral-900/95 backdrop-blur border-l border-white/10 z-[1000] shadow-2xl flex flex-col"
        >
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-white truncate pr-4">{node.name}</h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">FRI Risk Assessment</div>
              <div className="flex items-end gap-2">
                <span className={`text-4xl font-mono font-bold ${node.fri.color}`}>{node.fri.score.toFixed(2)}</span>
                <span className={`text-sm mb-1 ${node.fri.color}`}>{node.fri.level}</span>
              </div>
              <p className="text-sm text-neutral-400 mt-2">{node.drainStatus}</p>
            </div>
            
            <div className="bg-black/50 p-3 rounded-lg border border-white/5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">V_Pooling:</span>
                <span className="font-mono">{node.vPooling.toFixed(2)} (simulated)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">A_Impedance:</span>
                <span className="font-mono">{node.aImpedance.toFixed(2)} (simulated)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">R_Rate:</span>
                <span className="font-mono text-cyan-400">{node.rRate.toFixed(2)}</span>
              </div>
            </div>

            {weather && (
              <div>
                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Local Weather</span>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-500 px-1.5 py-0.5 rounded border border-cyan-500/20">LIVE</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-neutral-950 p-3 rounded border border-white/5 flex flex-col items-center">
                    <Thermometer className="w-4 h-4 text-orange-400 mb-1" />
                    <span className="text-xs text-neutral-400">Temp</span>
                    <span className="font-bold">{weather.tempC}°C</span>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded border border-white/5 flex flex-col items-center">
                    <CloudRain className="w-4 h-4 text-cyan-400 mb-1" />
                    <span className="text-xs text-neutral-400">Rain</span>
                    <span className="font-bold">{weather.rainMmH} mm/h</span>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded border border-white/5 flex flex-col items-center">
                    <Droplets className="w-4 h-4 text-blue-400 mb-1" />
                    <span className="text-xs text-neutral-400">Humidity</span>
                    <span className="font-bold">{weather.humidity}%</span>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded border border-white/5 flex flex-col items-center">
                    <Wind className="w-4 h-4 text-neutral-400 mb-1" />
                    <span className="text-xs text-neutral-400">Wind</span>
                    <span className="font-bold">{weather.windKmh} km/h</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-neutral-400 text-center">
                  Max Precip Prob (next 6h): <span className="text-white">{weather.precipProbMax}%</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
