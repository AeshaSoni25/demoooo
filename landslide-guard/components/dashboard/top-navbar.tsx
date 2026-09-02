"use client";

import { useState } from "react";
import { Bell, Search, Menu, ChevronDown, User, MapPin, Zap, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoBadge } from "@/components/ui/demo-badge";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { useAuth } from "@/hooks/use-auth";
import { RiskBadge } from "@/components/ui/risk-badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const LOCATIONS = [
  "All Regions", "Himachal Pradesh", "Uttarakhand",
  "West Bengal", "Kerala", "Sikkim", "J&K", "Arunachal Pradesh",
];

interface TopNavbarProps { onMenuClick?: () => void; title?: string; }

export function TopNavbar({ onMenuClick, title }: TopNavbarProps) {
  const { isDemo, currentStep } = useDemoMode();
  const { logout, user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState("All Regions");
  const [showLocMenu, setShowLocMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const NOTIFS = [
    { text: "CRITICAL: Chamoli District escalated to 88/100", time: "3m ago", accent: "#ef4444" },
    { text: "HIGH: Shimla — rainfall threshold exceeded (248mm)", time: "25m ago", accent: "#f97316" },
    { text: "Alert acknowledged — Sikkim North District", time: "3h ago", accent: "#10b981" },
  ];

  return (
    <header
      className="sticky top-0 z-20 h-14 border-b"
      style={{
        background: "rgba(4,10,30,0.88)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderColor: "rgba(255,255,255,0.05)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.3)",
      }}
      role="banner"
    >
      <div className="flex items-center h-full px-4 gap-3">
        {/* Mobile hamburger */}
        <button onClick={onMenuClick} className="lg:hidden flex-shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors" aria-label="Menu">
          <Menu className="w-5 h-5" />
        </button>

        {title && <h2 className="text-sm font-semibold text-slate-300 lg:hidden">{title}</h2>}

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-64 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
          <input
            type="search"
            placeholder="Search locations, alerts..."
            className="w-full pl-9 pr-3 py-1.5 text-[12px] text-slate-300 placeholder-slate-600 rounded-lg"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            aria-label="Search"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Demo badge */}
          {isDemo && <DemoBadge className="hidden sm:inline-flex" />}

          {/* Live risk pill */}
          {isDemo && (
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border"
              style={{ background:"rgba(255,255,255,0.03)", borderColor:"rgba(255,255,255,0.07)" }}>
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="text-[11px] text-slate-500">Risk:</span>
              <RiskBadge level={currentStep.riskLevel} size="sm" pulse />
              <span className="text-[13px] font-bold text-white tabular-nums">{currentStep.riskScore}</span>
            </div>
          )}

          {/* Location selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => { setShowLocMenu(v => !v); setShowNotifs(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-slate-400 hover:text-slate-200 transition-colors border"
              style={{ background:"rgba(255,255,255,0.03)", borderColor:"rgba(255,255,255,0.07)" }}
              aria-expanded={showLocMenu}
              aria-haspopup="listbox"
            >
              <MapPin className="w-3 h-3 text-indigo-400" />
              {selectedLocation}
              <ChevronDown className="w-3 h-3 text-slate-600" />
            </button>

            {showLocMenu && (
              <div className="absolute right-0 mt-1.5 w-52 rounded-xl overflow-hidden z-50 glass-strong py-1"
                role="listbox">
                {LOCATIONS.map(loc => (
                  <button key={loc} role="option" aria-selected={loc === selectedLocation}
                    onClick={() => { setSelectedLocation(loc); setShowLocMenu(false); }}
                    className={cn("w-full text-left px-3 py-2 text-[12px] transition-colors hover:bg-white/[0.06]",
                      loc === selectedLocation ? "text-indigo-300" : "text-slate-400")}>
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifs(v => !v); setShowLocMenu(false); }}
              className="relative p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.05] transition-colors"
              aria-label="Notifications" aria-expanded={showNotifs}
            >
              <Bell className="w-[17px] h-[17px]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"
                style={{ boxShadow:"0 0 6px rgba(239,68,68,0.8)" }} aria-hidden="true" />
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-1.5 w-76 rounded-xl overflow-hidden z-50 glass-strong"
                style={{ width:"300px" }}>
                <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-white">Notifications</p>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-full">3 new</span>
                </div>
                <div>
                  {NOTIFS.map((n, i) => (
                    <div key={i} className="px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer"
                      style={{ borderLeft:`2px solid ${n.accent}` }}>
                      <p className="text-[12px] text-slate-200 leading-snug">{n.text}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-white/[0.05]">
                  <a href="/alerts" className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors">
                    View all alerts →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* User avatar */}
          <div className="relative">
            <button
              onClick={() => { setShowUserMenu(v => !v); setShowNotifs(false); setShowLocMenu(false); }}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/[0.05] transition-colors"
              aria-label="Profile"
              aria-expanded={showUserMenu}
              aria-haspopup="menu"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background:"linear-gradient(135deg,#4f46e5,#3b82f6)", boxShadow:"0 0 10px rgba(79,70,229,0.4)" }}>
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[12px] font-medium text-slate-400 hidden sm:block">{user?.name || "Admin"}</span>
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-1.5 w-56 rounded-xl overflow-hidden z-50 glass-strong"
                role="menu"
              >
                <div className="px-4 py-3 border-b border-white/[0.05]">
                  <p className="text-[12px] font-semibold text-white">Account</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{user?.email || "admin@landslide-guard.com"}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 flex items-center gap-2 text-[12px] text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/[0.05]"
                  role="menuitem"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
