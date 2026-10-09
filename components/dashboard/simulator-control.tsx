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

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('autoplay=storm')) {
      setPreset("STORM");
      if (!isPlaying) togglePlay();
      // clean up url without refresh
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [setPreset, isPlaying, togglePlay]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      
      switch(e.key) {
        case '1': setPreset("CLEAR"); break;
        case '2': setPreset("RAIN"); break;
        case '3': setPreset("CHOKE"); break;
        case '4': setPreset("STORM"); break;
        case ' ': 
          e.preventDefault();
          togglePlay(); 
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setPreset, togglePlay]);

  // Check for critical nodes to trigger toast
  const [criticalToastShown, setCriticalToastShown] = useState(false);
  
  useEffect(() => {
    // Post to API when nodes change
    nodes.forEach(n => {
      fetch("/api/nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId: n.id.replace("node-", ""), v_pooling: n.vPooling, a_impedance: n.aImpedance, rain_rate: n.rRate })
      }).catch(() => {});
    });

    const criticalNode = nodes.find(n => n.fri.score > 0.86);
    if (criticalNode && !criticalToastShown) {
      toast(
        <div className="flex flex-col space-y-2 w-full">
          <div className="font-bold text-red-500">[CRITICAL ALERT - FLOODGUARD AI]</div>
          <div>Node: {criticalNode.id.replace("node-", "")} ({criticalNode.name})</div>
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
        {presets.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setPreset(p.id)}
            className={cn(
              "px-3 py-1.5 rounded-md flex items-center space-x-2 text-sm transition-colors",
              preset === p.id ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-neutral-300"
            )}
            title={`Shortcut: ${i + 1}`}
          >
            {p.icon}
            <span className="hidden md:inline">{p.label}</span>
            <kbd className="hidden lg:inline-block text-[10px] bg-neutral-900 border border-neutral-700 px-1.5 rounded text-neutral-500">{i + 1}</kbd>
          </button>
        ))}
      </div>
      <button
        onClick={togglePlay}
        title="Shortcut: Space"
        className={cn(
          "p-2 rounded-lg flex items-center justify-center transition-colors group relative",
          isPlaying ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-green-500/20 text-green-500 hover:bg-green-500/30"
        )}
      >
        {isPlaying ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
    </div>
  );
};
