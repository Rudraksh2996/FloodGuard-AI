"use client";
import React, { useEffect, useState } from "react";
import { RiskMap } from "@/components/dashboard/risk-map";
import { DispatchQueue } from "@/components/dashboard/dispatch-queue";
import { SimulatorControl } from "@/components/dashboard/simulator-control";
import Link from "next/link";
import { Activity, LayoutDashboard, Settings } from "lucide-react";
import { useSimulatorStore } from "@/store/simulator-store";

function DataSourceToggle() {
  const { liveMode, setLiveMode } = useSimulatorStore();
  
  return (
    <div className="flex items-center gap-3 ml-4">
      <div className="bg-neutral-900 rounded-lg p-1 flex border border-white/10">
        <button 
          onClick={() => setLiveMode(false)}
          className={`px-3 py-1 text-xs rounded transition-colors ${!liveMode ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"}`}
        >
          Simulation
        </button>
        <button 
          onClick={() => setLiveMode(true)}
          className={`px-3 py-1 text-xs rounded transition-colors ${liveMode ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"}`}
        >
          Live weather
        </button>
      </div>
      
      {liveMode ? (
        <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded text-cyan-500 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          LIVE · Open-Meteo
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 px-2 py-1 rounded text-neutral-400 text-xs font-bold">
          SIMULATION
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [awsConnected, setAwsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/nodes")
      .then(res => {
        if (res.headers.get("x-data-source") === "dynamodb") {
          setAwsConnected(true);
        } else {
          setAwsConnected(false);
        }
      })
      .catch(() => setAwsConnected(false));
  }, []);

  return (
    <div className="flex h-[100dvh] bg-black overflow-hidden text-sm">
      {/* Sidebar */}
      <div className="w-16 md:w-64 border-r border-white/10 bg-neutral-950 flex flex-col justify-between">
        <div>
          <div className="p-4 border-b border-white/10 flex items-center justify-center md:justify-start gap-3">
            <Activity className="text-cyan-500 w-6 h-6" />
            <span className="hidden md:block font-bold">FloodGuard AI</span>
          </div>
          <nav className="p-2 space-y-2">
            {[
              { label: "Live Map", icon: <LayoutDashboard className="w-5 h-5" /> },
              { label: "Settings", icon: <Settings className="w-5 h-5" /> },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer text-neutral-400 hover:text-white transition-colors">
                {item.icon}
                <span className="hidden md:block">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-white/10 text-center">
          <Link href="/" className="text-xs text-neutral-500 hover:text-white">Exit</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0 bg-neutral-950">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg hidden md:block">Municipal Command Center</h1>
            {awsConnected === true ? (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded text-green-500 text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                AWS connected
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded text-yellow-500 text-xs">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                Demo data
              </div>
            )}
            
            <DataSourceToggle />
          </div>
          <SimulatorControl />
        </header>
        
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          <div className="flex-1 p-4 relative z-0">
            <RiskMap />
          </div>
          <DispatchQueue />
        </div>
      </div>
    </div>
  );
}
