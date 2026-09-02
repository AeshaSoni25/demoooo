"use client";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, children, action, className }: ChartCardProps) {
  return (
    <div className={cn("rounded-2xl p-5", className)}
      style={{ background:"rgba(8,15,42,0.6)", border:"1px solid rgba(255,255,255,0.06)", boxShadow:"0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[13px] font-bold text-white">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-600 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0 text-slate-600">{action}</div>}
      </div>
      {children}
    </div>
  );
}
