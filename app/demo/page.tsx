"use client";
import React, { useState } from "react";
import Link from "next/link";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

interface AnalysisResult {
  labels: { name: string; confidence: number }[];
  vPooling: number;
}

export default function DemoPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<null | AnalysisResult>(null);

  const handleUpload = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setResult({
        labels: [
          { name: "Water", confidence: 94.5 },
          { name: "Flood", confidence: 88.2 },
          { name: "Road", confidence: 85.1 },
          { name: "Vehicle", confidence: 71.0 },
        ],
        vPooling: 0.88,
      });
      setAnalyzing(false);
    }, 800);
  };

  return (
    <div className="min-h-[100dvh] bg-neutral-950 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 text-neutral-500 hover:text-white">
        &larr; Back to Home
      </Link>
      
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">Live Rekognition Test</h1>
        <p className="text-neutral-400 text-center mb-8">
          Upload a CCTV frame to test the Visual Perception Engine.
        </p>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 mb-8 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-sm aspect-video bg-neutral-800 rounded-lg border-2 border-dashed border-neutral-700 flex items-center justify-center mb-6 cursor-pointer hover:border-neutral-500 transition-colors" onClick={handleUpload}>
            <div className="flex flex-col items-center">
              <UploadCloud className="w-8 h-8 text-neutral-500 mb-2" />
              <span className="text-sm text-neutral-400">Click to run mock analysis</span>
            </div>
          </div>
          
          {analyzing && <div className="text-cyan-500 animate-pulse">Analyzing frame via AWS Rekognition...</div>}
          
          {result && (
            <div className="w-full text-left space-y-4">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-5 h-5" />
                <span>Analysis Complete (800ms)</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {result.labels.map((l, i) => (
                  <div key={i} className="flex justify-between items-center bg-neutral-950 p-3 rounded border border-white/5">
                    <span className={l.confidence > 90 ? "text-cyan-400 font-bold" : "text-neutral-300"}>{l.name}</span>
                    <span className="font-mono text-sm">{l.confidence.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg flex justify-between items-center">
                <span className="text-orange-500">Calculated V_pooling:</span>
                <span className="font-mono text-xl font-bold text-orange-400">{result.vPooling}</span>
              </div>
            </div>
          )}
        </div>

        {result && (
           <HoverBorderGradient
           containerClassName="w-full rounded-xl"
           as="button"
           className="bg-neutral-900 w-full text-white flex justify-center py-4"
           onClick={() => alert("SMS Sent to dispatch queue.")}
         >
           <span className="flex items-center gap-2">
             <AlertCircle className="w-5 h-5" /> Send Test SMS via SNS
           </span>
         </HoverBorderGradient>
        )}
      </div>
    </div>
  );
}
