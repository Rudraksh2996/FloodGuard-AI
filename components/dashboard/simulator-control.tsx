"use client";
import React, { useEffect, useState } from "react";
import { useSimulatorStore } from "@/store/simulator-store";
import { Play, Square, Cloud, CloudRain, AlertTriangle, CloudLightning } from "lucide-react";
import { Preset } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const SimulatorControl = () => {
  const { preset, setPreset, isPlaying, togglePlay, tick, nodes } = useSimulatorStore();
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        tick();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, tick]);

  // Check for critical nodes to trigger toast
  const [criticalToastShown, setCriticalToastShown] = useState(false);
  
  useEffect(() => {
    const criticalNode = nodes.find(n => n.fri.score > 0.86);
    if (criticalNode && !criticalToastShown) {
      toast(
        <div className="flex flex-col space-y-2 w-full">
          <div className="font-bold text-red-500">[CRITICAL ALERT - FLOODGUARD AI]</div>
          <div>Node: {criticalNode.id} ({criticalNode.name})</div>
          <div>Risk Score: {criticalNode.fri.score.toFixed(2)} | Drain Status: {criticalNode.drainStatus}</div>
          <div className="text-xs text-neutral-400 mt-2">Rec. Action: {criticalNode.fri.action}</div>
        </div>,
        {
          duration: 10000,
          style: { background: '#0a0a0a', border: '1px solid #ef4444', color: 'white' }
        }
      );
      setCriticalToastShown(true);
    } else if (!criticalNode) {
      setCriticalToastShown(false);
    }
  }, [nodes, criticalToastShown]);

  const presets: { id: Preset; label: string; icon: React.ReactNode }[] = [
    { id: "CLEAR", label: "Clear", icon: <Cloud className="w-4 h-4" /> },
    { id: "RAIN", label: "Moderate (T+15m)", icon: <CloudRain className="w-4 h-4" /> },
    { id: "CHOKE", label: "Drain Choke (T+40m)", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "STORM", label: "Storm", icon: <CloudLightning className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center space-x-4 bg-neutral-900/50 p-2 rounded-xl border border-white/10 backdrop-blur">
      <div className="flex bg-neutral-950 rounded-lg p-1">
        {presets.map(p => (
          <button
            key={p.id}
            onClick={() => setPreset(p.id)}
            className={cn(
              "px-3 py-1.5 rounded-md flex items-center space-x-2 text-sm transition-colors",
              preset === p.id ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            {p.icon}
            <span className="hidden md:inline">{p.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={togglePlay}
        className={cn(
          "p-2 rounded-lg flex items-center justify-center transition-colors",
          isPlaying ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"
        )}
      >
        {isPlaying ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
    </div>
  );
};
