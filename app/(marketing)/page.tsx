"use client";
import React from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FlipWords } from "@/components/ui/flip-words";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { ShieldAlert, Clock, Activity, Target, Zap, Server, Phone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MarketingPage() {
  const navItems = [
    { name: "Features", link: "#features", icon: <ShieldAlert className="w-4 h-4" /> },
    { name: "How it Works", link: "#how-it-works", icon: <Activity className="w-4 h-4" /> },
    { name: "Impact", link: "#impact", icon: <Target className="w-4 h-4" /> },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-300 relative w-full overflow-hidden flex flex-col">
      <FloatingNav navItems={navItems} />

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="absolute inset-0 w-full h-full bg-[#05060a] z-20 [mask-image:radial-gradient(transparent,black)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_50%)] pointer-events-none z-0" />
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 opacity-30" fill="#06b6d4" />
        <BackgroundBeams />

        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full">
          <h1 className="text-4xl md:text-7xl font-semibold text-center text-white mb-6 tracking-[-0.03em] text-balance [text-shadow:0_0_30px_rgba(34,211,238,0.2)]">
            Predict floods <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-400">before the street submerges.</span>
          </h1>
          <div className="text-center text-lg md:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            A proactive multi-modal pipeline that fuses CCTV vision and storm-drain acoustics to alert municipal teams before 
            <FlipWords words={["gridlock.", "disaster.", "submersion.", "failure."]} className="font-medium text-white" />
          </div>
          
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <HoverBorderGradient
                  containerClassName="rounded-full hover:-translate-y-px transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400"
                  as="button"
                  className="dark:bg-neutral-950 bg-white text-black dark:text-white flex items-center space-x-2 font-medium"
                >
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <span>Launch Command Center</span>
                </HoverBorderGradient>
              </Link>
              <Link href="/demo" className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 hover:border-white/30 transition-all font-medium text-white flex items-center space-x-2 hover:-translate-y-px active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400">
                  <span>Try Live Demo</span>
              </Link>
            </div>
            
            <Link href="/dashboard?autoplay=storm" className="text-xs text-neutral-400 hover:text-white transition-colors underline underline-offset-4 flex items-center gap-1">
              Watch the storm simulate in 10 seconds &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto text-center border-t border-white/10 pt-8 md:divide-x divide-white/10">
            {[
              { label: "<2.5s", desc: "Ingestion Latency", icon: <Clock className="w-5 h-5 mx-auto mb-2 text-blue-400 opacity-100" /> },
              { label: "88.4%", desc: "Pre-submersion Accuracy", icon: <Target className="w-5 h-5 mx-auto mb-2 text-cyan-400 opacity-100" /> },
              { label: "$0.003", desc: "Cost per node/hour", icon: <Zap className="w-5 h-5 mx-auto mb-2 text-violet-400 opacity-100" /> },
              { label: "100%", desc: "Serverless", icon: <Server className="w-5 h-5 mx-auto mb-2 text-emerald-400 opacity-100" /> },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="flex flex-col py-4"
              >
                {stat.icon}
                <span className="text-3xl md:text-4xl font-bold text-white font-mono tabular-nums">{stat.label}</span>
                <span className="text-xs text-neutral-400 uppercase tracking-widest mt-1">{stat.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BENTO GRID */}
      <section id="features" className="py-24 relative z-10 px-4 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Intelligence at the Edge</h2>
        <BentoGrid>
          <BentoGridItem 
            title="Visual Perception Engine"
            description="Amazon Rekognition instantly detects surface pooling and calculates the V_pooling index."
            className="md:col-span-2"
            icon={<Target className="w-6 h-6 text-cyan-400" />}
            header={
              <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 border border-white/10 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80')] opacity-30 bg-cover bg-center" />
                <div className="absolute top-4 left-4 border border-cyan-500 bg-cyan-500/20 px-2 py-1 text-xs text-cyan-400 font-mono rounded">
                  Water 94%
                </div>
              </div>
            }
          />
          <BentoGridItem 
            title="Acoustic Drain Intelligence"
            description="SageMaker YAMNet detects gurgles and siltation frequencies to compute A_impedance."
            className="md:col-span-1"
            icon={<Activity className="w-6 h-6 text-blue-400" />}
            header={
              <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 border border-white/10 items-center justify-center overflow-hidden p-4">
                <div className="flex gap-1 items-end h-16 w-full opacity-70">
                  {Array.from({length: 20}).map((_, i) => (
                    <motion.div key={i} animate={{ height: [10, Math.random() * 50 + 10, 10] }} transition={{ repeat: Infinity, duration: 1 + Math.random() }} className="w-2 bg-blue-500 rounded-t" />
                  ))}
                </div>
              </div>
            }
          />
          <BentoGridItem 
            title="Instant SMS Dispatch"
            description="Critical alerts via SNS directly to field units."
            className="md:col-span-1"
            icon={<Phone className="w-6 h-6 text-violet-400" />}
          />
          <BentoGridItem 
            title="Multi-Modal Correlation"
            description="Lambda fuses vision and audio into the Flood Risk Index (FRI)."
            className="md:col-span-1"
            icon={<Zap className="w-6 h-6 text-orange-400" />}
          />
          <BentoGridItem 
            title="Zero New Hardware"
            description="Taps into existing municipal CCTV streams without expensive retrofits."
            className="md:col-span-1"
            icon={<Server className="w-6 h-6 text-green-400" />}
          />
        </BentoGrid>
      </section>

      {/* HOW IT WORKS / TRACING BEAM */}
      <section id="how-it-works" className="py-24 relative z-10 px-4 w-full bg-neutral-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Pipeline Architecture</h2>
          <TracingBeam className="px-6">
            <div className="space-y-16">
              {[
                { title: "1. Ingest (Kinesis)", desc: "Existing municipal CCTVs push raw streams and audio to AWS Kinesis Video Streams." },
                { title: "2. Perceive (Rekognition)", desc: "Frames are extracted every 3s. Rekognition identifies 'Water', 'Road', yielding the Pooling ratio (V)." },
                { title: "3. Listen (SageMaker)", desc: "YAMNet model analyzes audio spectrograms. A clear drain sounds like 2.5-8 kHz rushing water. A choked drain gurgles at 200-900 Hz, increasing Impedance (A)." },
                { title: "4. Correlate (Lambda)", desc: "FRI = 0.55*V + 0.35*A + 0.10*R. The score determines the risk tier dynamically." },
                { title: "5. Alert (SNS)", desc: "If FRI > 0.86, SNS pushes a priority SMS to the nearest hydro-jet truck, logged in DynamoDB." }
              ].map((step, i) => (
                <div key={i} className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-neutral-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </TracingBeam>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative z-10 px-4 w-full text-center flex flex-col items-center justify-center border-t border-white/10">
         <h2 className="text-4xl md:text-6xl font-bold mb-8">See it react in real time.</h2>
         <Link href="/dashboard">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 font-medium px-8 py-3 text-lg"
            >
              <span>Launch Simulator</span>
            </HoverBorderGradient>
          </Link>
      </section>
      
      <footer className="py-8 text-center text-sm text-neutral-500 border-t border-white/10 relative z-10 bg-neutral-950">
        Built at DTU Environmental Hacks 2026
      </footer>
    </main>
  );
}
