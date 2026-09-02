"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, Brain, Activity, Bell, BarChart2,
  Siren, Users, Settings, Shield, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoModeToggle } from "@/components/ui/demo-mode-toggle";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard",   label: "Dashboard",          icon: LayoutDashboard, group: "main" },
  { href: "/risk-map",    label: "Risk Map",            icon: Map,             group: "main" },
  { href: "/predictions", label: "AI Predictions",      icon: Brain,           group: "main" },
  { href: "/monitoring",  label: "Live Monitoring",     icon: Activity,        group: "main" },
  { href: "/alerts",      label: "Alerts",              icon: Bell,            group: "main", badge: 5 },
  { href: "/analytics",   label: "Analytics",           icon: BarChart2,       group: "tools" },
  { href: "/emergency",   label: "Emergency Response",  icon: Siren,           group: "tools" },
  { href: "/community",   label: "Community View",      icon: Users,           group: "tools" },
  { href: "/settings",    label: "Settings",            icon: Settings,        group: "system" },
];

const GROUPS: Record<string, string> = { main: "Operations", tools: "Tools", system: "System" };

interface SidebarProps { isOpen?: boolean; onClose?: () => void; }

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const grouped = NAV_ITEMS.reduce<Record<string, typeof NAV_ITEMS>>((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out",
          "border-r border-white/[0.05]",
          collapsed ? "w-[60px]" : "w-[240px]",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          background: "linear-gradient(180deg, #060d24 0%, #040a1e 100%)",
          boxShadow: "inset -1px 0 0 rgba(255,255,255,0.04), 4px 0 24px rgba(0,0,0,0.4)",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-16 flex-shrink-0 border-b border-white/[0.05]",
          collapsed ? "justify-center px-0" : "gap-3 px-4"
        )}>
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
                boxShadow: "0 0 16px rgba(79,70,229,0.5), 0 2px 8px rgba(0,0,0,0.3)",
              }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2 border-[#060d24]" />
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-white leading-none tracking-tight">
                LandslideGuard
              </p>
              <p className="text-[10px] font-medium mt-0.5"
                style={{ background: "linear-gradient(90deg,#6366f1,#38bdf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                AI Early Warning
              </p>
            </div>
          )}

          {!collapsed && onClose && (
            <button onClick={onClose} className="ml-auto text-slate-500 hover:text-slate-300 lg:hidden transition-colors" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2" role="navigation">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-4">
              {!collapsed && (
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600 px-2 mb-1.5">
                  {GROUPS[group]}
                </p>
              )}
              <ul className="space-y-0.5" role="list">
                {items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "flex items-center rounded-xl transition-all duration-200 group relative",
                          collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                          isActive ? "nav-active text-indigo-300" : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon className={cn(
                          "flex-shrink-0 transition-all",
                          collapsed ? "w-[18px] h-[18px]" : "w-4 h-4",
                          isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                        )} />

                        {!collapsed && (
                          <>
                            <span className="flex-1 text-[13px] font-medium truncate">{item.label}</span>
                            {item.badge && (
                              <span className="flex-shrink-0 text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1"
                                style={{ background: "linear-gradient(135deg,#ef4444,#f97316)", color:"white", boxShadow:"0 0 8px rgba(239,68,68,0.5)" }}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}

                        {/* Active bar */}
                        {isActive && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-l-full bg-indigo-400" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-white/[0.05] p-3 space-y-2">
          {!collapsed && <DemoModeToggle />}

          {!collapsed && (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-emerald-500/8">
              <span className="status-dot bg-emerald-400" style={{ background: "#10b981" }} />
              <span className="text-[10px] text-emerald-400/70 font-medium">Systems Operational</span>
            </div>
          )}

          <button
            onClick={() => setCollapsed(v => !v)}
            className="hidden lg:flex items-center justify-center w-full py-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] transition-colors text-xs gap-1.5"
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed
              ? <ChevronRight className="w-3.5 h-3.5" />
              : <><ChevronLeft className="w-3.5 h-3.5" /><span className="text-[10px]">Collapse</span></>
            }
          </button>
        </div>
      </aside>

      {/* Spacer */}
      <div className={cn("hidden lg:block flex-shrink-0 transition-all duration-300", collapsed ? "w-[60px]" : "w-[240px]")} aria-hidden="true" />
    </>
  );
}
