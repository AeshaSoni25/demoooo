"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Shield, ArrowRight, Brain, Map, Activity, Bell,
  BarChart2, Siren, ChevronRight, CheckCircle, Zap, AlertTriangle,
} from "lucide-react";
import { DemoBadge } from "@/components/ui/demo-badge";
import { RiskBadge } from "@/components/ui/risk-badge";

const STATS = [
  { value: "128",   label: "Areas Monitored",    color: "#6366f1" },
  { value: "342",   label: "Active Sensors",      color: "#38bdf8" },
  { value: "17",    label: "High-Risk Zones",     color: "#f97316" },
  { value: "24",    label: "Alerts Issued",       color: "#ef4444" },
  { value: "91.6%", label: "Prediction Accuracy", color: "#10b981" },
];

const FEATURES = [
  { icon: Brain,    title: "AI Risk Prediction",     desc: "Transparent weighted scoring engine analyzes 6 environmental factors and produces explainable risk assessments.", accent: "#6366f1" },
  { icon: Map,      title: "Interactive Risk Map",    desc: "OpenStreetMap visualization of landslide-prone zones with live marker clustering and condition drawers.", accent: "#38bdf8" },
  { icon: Activity, title: "Live Sensor Monitoring",  desc: "Simulated IoT sensor feeds — rain gauges, soil moisture probes, tilt sensors, and ground displacement meters.", accent: "#10b981" },
  { icon: Bell,     title: "Early Warning Alerts",    desc: "Multi-tier alert system (LOW → CRITICAL) with 9-step automated escalation workflow to emergency response.", accent: "#f97316" },
  { icon: BarChart2,"title": "Risk Analytics",       desc: "Time-series charts of rainfall vs risk, alert frequency, regional distribution, and sensor health.", accent: "#a78bfa" },
  { icon: Siren,    title: "Emergency Response",      desc: "Integrated directory of hospitals, NDRF centers, shelters, evacuation routes, and district authorities.", accent: "#ef4444" },
];

const WORKFLOW = [
  { icon: "🌧️", step: "01", label: "Monitor",   color: "#38bdf8" },
  { icon: "⚡",  step: "02", label: "Detect",    color: "#6366f1" },
  { icon: "🧠", step: "03", label: "Predict",   color: "#a78bfa" },
  { icon: "🚨", step: "04", label: "Warn",      color: "#f97316" },
  { icon: "🚁", step: "05", label: "Respond",   color: "#ef4444" },
];

const ALERT_TICKERS = [
  { loc: "Shimla Foothills", level: "CRITICAL" as const, score: 91 },
  { loc: "Chamoli District", level: "CRITICAL" as const, score: 88 },
  { loc: "Darjeeling Hills", level: "HIGH"     as const, score: 78 },
  { loc: "Uttarkashi",       level: "HIGH"     as const, score: 76 },
  { loc: "Wayanad",          level: "HIGH"     as const, score: 69 },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen text-slate-200" style={{ background:"#03071a" }}>

      {/* ─── NAVBAR ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 h-14 border-b"
        style={{ background:"rgba(3,7,26,0.85)", backdropFilter:"blur(20px) saturate(180%)", WebkitBackdropFilter:"blur(20px) saturate(180%)", borderColor:"rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#4f46e5,#3b82f6)", boxShadow:"0 0 16px rgba(79,70,229,0.5)" }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[14px] font-bold text-white tracking-tight">LandslideGuard</span>
              <span className="ml-1 text-[14px] font-bold" style={{ background:"linear-gradient(90deg,#6366f1,#38bdf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>AI</span>
            </div>
            <DemoBadge className="hidden sm:inline-flex ml-1" />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden sm:flex btn-primary text-[12px]">
              Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/dashboard" className="sm:hidden p-2 rounded-xl btn-ghost">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid opacity-100" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background:"radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 70%)" }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" aria-hidden="true"
          style={{ background:"radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)", filter:"blur(40px)" }} />
        <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full pointer-events-none" aria-hidden="true"
          style={{ background:"radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", filter:"blur(60px)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 border text-[12px] font-semibold"
              style={{ background:"rgba(16,185,129,0.08)", borderColor:"rgba(16,185,129,0.2)", color:"#34d399" }}>
              <span className="status-dot" style={{ background:"#10b981", width:6, height:6 }} />
              All Monitoring Systems Operational
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white leading-[1.1] tracking-tight mb-6">
              AI-Powered{" "}
              <span style={{ background:"linear-gradient(135deg,#6366f1 0%,#3b82f6 50%,#06b6d4 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Landslide
              </span>{" "}
              Early Warning System
            </h1>

            <p className="text-[16px] sm:text-lg text-slate-400 leading-relaxed mb-8 max-w-2xl">
              Monitor environmental conditions, predict landslide risk, and enable
              faster disaster response with AI-powered intelligence. Built for
              government authorities, disaster management teams, and emergency responders.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/dashboard" className="btn-primary text-[13px] px-5 py-2.5">
                Open Risk Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="btn-ghost text-[13px] px-5 py-2.5">
                Explore Features
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {["Interactive Risk Map", "Explainable AI", "Alert Escalation", "Demo Simulation", "Open Source Stack"].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 text-[11px] text-slate-500 border border-white/[0.06] px-2.5 py-1 rounded-full"
                  style={{ background:"rgba(255,255,255,0.02)" }}>
                  <CheckCircle className="w-3 h-3 text-indigo-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hero dashboard preview */}
          <div className="mt-16 relative">
            {/* Glow behind card */}
            <div className="absolute -inset-4 rounded-3xl pointer-events-none" aria-hidden="true"
              style={{ background:"radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)", filter:"blur(20px)" }} />

            <div className="relative rounded-2xl overflow-hidden border"
              style={{ borderColor:"rgba(255,255,255,0.06)", boxShadow:"0 0 0 1px rgba(99,102,241,0.1), 0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)" }}>

              {/* Browser bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b"
                style={{ background:"rgba(5,10,30,0.95)", borderColor:"rgba(255,255,255,0.05)" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-[11px] text-slate-500 border border-white/[0.05]"
                    style={{ background:"rgba(255,255,255,0.03)" }}>
                    🔒 localhost:3001/dashboard
                  </div>
                </div>
                <DemoBadge />
              </div>

              {/* Terrain viz */}
              <div className="relative overflow-hidden" style={{ height: "340px", background:"linear-gradient(180deg,#05091a 0%,#080f2a 60%,#0a1535 100%)" }}>
                <div className="absolute inset-0 bg-grid-subtle opacity-50" aria-hidden="true" />

                {/* SVG mountains */}
                <svg viewBox="0 0 1200 340" className="absolute bottom-0 w-full" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d2040" /><stop offset="100%" stopColor="#070e24" />
                    </linearGradient>
                    <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#102548" /><stop offset="100%" stopColor="#090f28" />
                    </linearGradient>
                    <linearGradient id="m3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#132d58" /><stop offset="100%" stopColor="#0c1535" />
                    </linearGradient>
                  </defs>
                  <path d="M0,340 L0,220 L80,150 L180,195 L280,110 L380,160 L480,80 L580,130 L680,60 L780,105 L880,45 L980,90 L1080,35 L1180,75 L1200,60 L1200,340Z" fill="url(#m1)"/>
                  <path d="M0,340 L0,260 L120,190 L240,225 L360,155 L460,195 L560,120 L660,170 L760,95 L860,140 L960,80 L1060,130 L1160,70 L1200,110 L1200,340Z" fill="url(#m2)"/>
                  <path d="M0,340 L0,290 L160,235 L320,270 L480,200 L640,250 L800,185 L960,230 L1120,210 L1200,250 L1200,340Z" fill="url(#m3)"/>
                </svg>

                {/* Risk zone markers */}
                {[
                  { label:"Shimla",    level:"CRITICAL" as const, x:"18%",  y:"28%" },
                  { label:"Chamoli",   level:"CRITICAL" as const, x:"38%",  y:"22%" },
                  { label:"Darjeeling",level:"HIGH"     as const, x:"60%",  y:"30%" },
                  { label:"Wayanad",   level:"HIGH"     as const, x:"44%",  y:"55%" },
                  { label:"Sikkim",    level:"MODERATE" as const, x:"74%",  y:"40%" },
                  { label:"Coorg",     level:"LOW"      as const, x:"28%",  y:"65%" },
                ].map(zone => (
                  <div key={zone.label} className="absolute flex flex-col items-center gap-1" style={{ left:zone.x, top:zone.y }} aria-label={`${zone.label}: ${zone.level}`}>
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full border-2 border-white/30 ${
                        zone.level==="CRITICAL"?"bg-red-500":zone.level==="HIGH"?"bg-orange-500":zone.level==="MODERATE"?"bg-amber-500":"bg-emerald-500"
                      }`}
                        style={{ boxShadow:`0 0 8px ${zone.level==="CRITICAL"?"#ef4444":zone.level==="HIGH"?"#f97316":zone.level==="MODERATE"?"#f59e0b":"#10b981"}` }} />
                      {(zone.level==="CRITICAL"||zone.level==="HIGH") && (
                        <div className={`absolute inset-0 rounded-full animate-ping ${zone.level==="CRITICAL"?"bg-red-500":"bg-orange-500"} opacity-40`} />
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <RiskBadge level={zone.level} size="sm" />
                      <span className="text-[9px] text-slate-300 font-semibold whitespace-nowrap">{zone.label}</span>
                    </div>
                  </div>
                ))}

                {/* Top HUD panels */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px]"
                  style={{ background:"rgba(99,102,241,0.12)", borderColor:"rgba(99,102,241,0.25)", backdropFilter:"blur(8px)" }}>
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-indigo-300 font-semibold">AI Analysis Active</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px]"
                  style={{ background:"rgba(5,10,30,0.8)", borderColor:"rgba(255,255,255,0.08)", backdropFilter:"blur(8px)" }}>
                  <span className="text-slate-500">Rainfall:</span>
                  <span className="text-blue-300 font-bold">182 mm/24h</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                </div>

                {/* Bottom stats bar */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-4 px-4 py-3 border-t"
                  style={{ background:"rgba(3,7,26,0.9)", backdropFilter:"blur(12px)", borderColor:"rgba(255,255,255,0.05)" }}>
                  <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Alerts
                  </span>
                  <div className="flex-1 flex items-center gap-4 overflow-hidden">
                    {ALERT_TICKERS.map((a, i) => (
                      <span key={i} className="flex-shrink-0 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <RiskBadge level={a.level} size="sm" />
                        <span className="text-slate-300 font-medium">{a.loc}</span>
                        <span className="font-mono text-white">{a.score}/100</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────── */}
      <section className="border-y py-12" style={{ borderColor:"rgba(255,255,255,0.05)", background:"rgba(255,255,255,0.01)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            {STATS.map((s, i) => (
              <div key={s.label} className="text-center group">
                <div className="text-3xl sm:text-4xl font-black tabular-nums mb-1"
                  style={{ background:`linear-gradient(135deg,${s.color},${s.color}88)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  {s.value}
                </div>
                <div className="text-[12px] font-medium text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-slate-700 mt-6">
            ★ Demo / Simulated Data — Prototype for Smart India Hackathon demonstration
          </p>
        </div>
      </section>

      {/* ─── WORKFLOW ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-24" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-semibold mb-4"
            style={{ borderColor:"rgba(99,102,241,0.2)", background:"rgba(99,102,241,0.06)", color:"#818cf8" }}>
            <Zap className="w-3 h-3" /> Complete Disaster Cycle
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">How It Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-[15px] mb-14">
            Five integrated stages form a complete disaster management pipeline — from raw sensor data to coordinated emergency response.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-0 relative">
            {/* Connecting line */}
            <div className="absolute top-[30px] left-[20%] right-[20%] h-px hidden sm:block"
              style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.3),rgba(99,102,241,0.3),transparent)" }} />

            {WORKFLOW.map((w, i) => (
              <div key={w.step} className="flex sm:flex-col items-center gap-3 sm:gap-0 sm:w-44 relative">
                <div className="flex-shrink-0 w-[60px] h-[60px] rounded-2xl flex flex-col items-center justify-center border relative z-10"
                  style={{ background:`linear-gradient(135deg,${w.color}18,${w.color}08)`, borderColor:`${w.color}30`, boxShadow:`0 0 20px ${w.color}20` }}>
                  <span className="text-xl">{w.icon}</span>
                </div>
                <div className="sm:mt-3 sm:text-center">
                  <span className="block text-[9px] font-bold text-slate-600 mb-0.5">{w.step}</span>
                  <span className="text-[13px] font-bold text-white">{w.label}</span>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-700 hidden sm:block absolute -right-2 top-4 z-20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 relative" id="features">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background:"radial-gradient(ellipse 60% 40% at 50% 50%, rgba(99,102,241,0.04) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">Core Features</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-[15px]">
              Purpose-built for landslide risk management — not a generic analytics dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-card rounded-2xl p-5 group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105"
                    style={{ background:`${f.accent}15`, border:`1px solid ${f.accent}25`, boxShadow:`0 0 16px ${f.accent}15` }}>
                    <Icon className="w-5 h-5" style={{ color: f.accent }} />
                  </div>
                  <h3 className="text-[14px] font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── EXPLAINABLE AI SHOWCASE ──────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl overflow-hidden border" style={{ borderColor:"rgba(99,102,241,0.15)", background:"linear-gradient(135deg,rgba(8,15,42,0.8) 0%,rgba(5,9,26,0.9) 100%)", boxShadow:"0 0 0 1px rgba(99,102,241,0.08), 0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: text */}
              <div className="p-8 sm:p-10 border-b lg:border-b-0 lg:border-r" style={{ borderColor:"rgba(255,255,255,0.05)" }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-semibold mb-5"
                  style={{ borderColor:"rgba(99,102,241,0.2)", background:"rgba(99,102,241,0.06)", color:"#818cf8" }}>
                  <Brain className="w-3 h-3" /> Explainable AI
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight leading-tight">
                  Not just a number — <span style={{ background:"linear-gradient(135deg,#6366f1,#38bdf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>understand why</span>
                </h2>
                <p className="text-slate-400 text-[14px] leading-relaxed mb-6">
                  Every risk score comes with a complete breakdown showing which environmental factors are driving the risk. Decision-makers see exactly what's happening — building trust and enabling faster responses.
                </p>
                <Link href="/predictions" className="btn-primary text-[12px]">
                  Try AI Prediction <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Right: XAI bars */}
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sample: Darjeeling Hills</p>
                    <p className="text-2xl font-black mt-1" style={{ background:"linear-gradient(135deg,#f97316,#ef4444)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                      HIGH RISK 78/100
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-600">AI Confidence</p>
                    <p className="text-xl font-bold text-indigo-400">93%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { f:"Rainfall Intensity",     pct:35, color:"#3b82f6",  val:"182 mm/24h" },
                    { f:"Soil Saturation",         pct:25, color:"#06b6d4",  val:"87%" },
                    { f:"Ground Movement",         pct:20, color:"#f97316",  val:"6.4 mm/day" },
                    { f:"Slope Angle",             pct:12, color:"#a78bfa",  val:"38°" },
                    { f:"Historical Susceptibility",pct:8, color:"#f87171",  val:"14 events" },
                  ].map(item => (
                    <div key={item.f}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:item.color }} />
                          <span className="text-[12px] text-slate-300 font-medium">{item.f}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500">{item.val}</span>
                          <span className="text-[12px] font-bold text-white w-8 text-right">{item.pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.05)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width:`${item.pct}%`, background:`linear-gradient(90deg,${item.color},${item.color}99)`, boxShadow:`0 0 8px ${item.color}50` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background:"radial-gradient(ellipse 50% 60% at 50% 100%, rgba(79,70,229,0.12) 0%, transparent 70%)" }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border text-[11px] font-semibold"
            style={{ borderColor:"rgba(245,158,11,0.25)", background:"rgba(245,158,11,0.06)", color:"#fbbf24" }}>
            <Zap className="w-3 h-3" /> Smart India Hackathon 2024
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            Predict.{" "}
            <span style={{ background:"linear-gradient(135deg,#6366f1,#38bdf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Prevent.</span>{" "}
            Protect.
          </h2>
          <p className="text-slate-400 text-[15px] mb-8 leading-relaxed max-w-xl mx-auto">
            A fully functional Next.js prototype demonstrating AI-assisted disaster management. Architecture is ready for real IoT sensors and trained ML models.
          </p>
          <Link href="/dashboard" className="btn-primary text-[14px] px-8 py-3">
            Open Risk Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t py-6" style={{ borderColor:"rgba(255,255,255,0.05)" }} role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[12px] text-slate-600">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            LandslideGuard AI — SIH Prototype
            <DemoBadge />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-700">
            <AlertTriangle className="w-3 h-3" />
            Not for operational use. All data is simulated.
          </div>
        </div>
      </footer>
    </div>
  );
}
