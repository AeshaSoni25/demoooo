"use client";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoBadgeProps { label?: string; className?: string; }

export function DemoBadge({ label = "Demo Data", className }: DemoBadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide", className)}
      style={{ background:"rgba(245,158,11,0.1)", color:"#fbbf24", border:"1px solid rgba(245,158,11,0.2)" }}
    >
      <FlaskConical className="w-3 h-3" />
      {label}
    </span>
  );
}
