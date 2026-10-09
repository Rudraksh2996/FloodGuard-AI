"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { toast } from "sonner";

interface AnalysisResult {
  labels: { Name: string; Confidence: number; Instances?: { BoundingBox: { Left: number, Top: number, Width: number, Height: number } }[] }[];
  vPooling: number;
}

export default function DemoPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<null | AnalysisResult>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [dispatching, setDispatching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setImageSrc(base64);
      setAnalyzing(true);
      setResult(null);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64.split(",")[1] }),
        });
        const data = await res.json();
        
        if (!res.ok) {
          toast.error(data.error || "Analysis failed");
        } else {
          setResult({
            labels: data.labels,
            vPooling: data.v_pooling
          });
        }
      } catch {
        toast.error("Network error analyzing image");
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDispatch = async () => {
    setDispatching(true);
    try {
      const res = await fetch("/api/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nodeId: 4, 
          nodeName: "DTU Main Gate", 
          fri: 0.92, 
          drainStatus: "Simulated Choke", 
          action: "Dispatch Response Unit" 
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          <div className="flex flex-col space-y-1">
            <b>📱 SMS Sent!</b>
            <span className="text-xs">Message ID: {data.messageId}</span>
          </div>,
          { duration: 5000 }
        );
      } else if (res.status === 429) {
        toast.error(`Cooldown active. Please wait ${data.remainingSeconds} seconds before dispatching again.`);
      } else {
        toast.error(data.error || "Dispatch failed");
      }
    } catch {
      toast.error("Network error during dispatch");
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-neutral-950 flex flex-col items-center justify-center p-4 py-16">
      <Link href="/" className="absolute top-8 left-8 text-neutral-500 hover:text-white">
        &larr; Back to Home
      </Link>
      
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">Live Rekognition Test</h1>
        <p className="text-neutral-400 text-center mb-8">
          Upload a CCTV frame to test the Visual Perception Engine.
        </p>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 mb-8 flex flex-col items-center justify-center text-center">
          <input type="file" accept="image/jpeg,image/png" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          
          <div 
            className="w-full aspect-video relative bg-neutral-800 rounded-lg border-2 border-dashed border-neutral-700 flex items-center justify-center mb-6 cursor-pointer hover:border-neutral-500 transition-colors overflow-hidden" 
            onClick={() => fileInputRef.current?.click()}
          >
            {imageSrc ? (
              <>
                <img src={imageSrc} alt="Uploaded" className="object-cover w-full h-full opacity-50" />
                {result?.labels.flatMap(l => l.Instances?.map((inst, i) => {
                  const box = inst.BoundingBox;
                  if (!box) return null;
                  return (
                    <div 
                      key={`${l.Name}-${i}`}
                      className="absolute border-2 border-cyan-500 bg-cyan-500/20"
                      style={{
                        left: `${box.Left * 100}%`,
                        top: `${box.Top * 100}%`,
                        width: `${box.Width * 100}%`,
                        height: `${box.Height * 100}%`
                      }}
                    >
                      <span className="absolute -top-6 left-0 bg-cyan-500 text-black text-[10px] font-bold px-1 whitespace-nowrap">
                        {l.Name}
                      </span>
                    </div>
                  );
                }))}
              </>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="w-8 h-8 text-neutral-500 mb-2" />
                <span className="text-sm text-neutral-400">Click to upload image</span>
              </div>
            )}
          </div>
          
          {analyzing && <div className="text-cyan-500 animate-pulse">Analyzing frame via AWS Rekognition...</div>}
          
          {result && (
            <div className="w-full text-left space-y-4 mt-4">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-5 h-5" />
                <span>Analysis Complete</span>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                {result.labels.map((l, i) => (
                  <div key={i} className="flex justify-between items-center bg-neutral-950 p-3 rounded border border-white/5">
                    <span className={l.Confidence > 90 ? "text-cyan-400 font-bold" : "text-neutral-300"}>{l.Name}</span>
                    <span className="font-mono text-sm">{l.Confidence.toFixed(1)}%</span>
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
           onClick={handleDispatch}
         >
           <span className="flex items-center gap-2">
             <AlertCircle className="w-5 h-5" /> {dispatching ? "Sending..." : "Send Test SMS via SNS"}
           </span>
         </HoverBorderGradient>
        )}
      </div>
    </div>
  );
}
