"use client";

import { Building2, Tent, Ambulance, Shield, Flame, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmergencyResource } from "@/types";

const typeConfig: Record<
  string,
  { icon: React.ReactNode; label: string; color: string; bg: string }
> = {
  HOSPITAL: {
    icon: <Ambulance className="w-4 h-4" />,
    label: "Hospital",
    color: "text-red-300",
    bg: "bg-red-500/15 border-red-500/30",
  },
  SHELTER: {
    icon: <Tent className="w-4 h-4" />,
    label: "Shelter",
    color: "text-blue-300",
    bg: "bg-blue-500/15 border-blue-500/30",
  },
  RESCUE_CENTER: {
    icon: <Shield className="w-4 h-4" />,
    label: "Rescue Center",
    color: "text-orange-300",
    bg: "bg-orange-500/15 border-orange-500/30",
  },
  POLICE: {
    icon: <Shield className="w-4 h-4" />,
    label: "Police",
    color: "text-indigo-300",
    bg: "bg-indigo-500/15 border-indigo-500/30",
  },
  FIRE_EMERGENCY: {
    icon: <Flame className="w-4 h-4" />,
    label: "Fire & Emergency",
    color: "text-orange-300",
    bg: "bg-orange-500/15 border-orange-500/30",
  },
  DISTRICT_AUTHORITY: {
    icon: <Landmark className="w-4 h-4" />,
    label: "District Authority",
    color: "text-purple-300",
    bg: "bg-purple-500/15 border-purple-500/30",
  },
};

interface EmergencyResourceCardProps {
  resource: EmergencyResource;
  className?: string;
}

export function EmergencyResourceCard({ resource, className }: EmergencyResourceCardProps) {
  const config = typeConfig[resource.type] ?? {
    icon: <Building2 className="w-4 h-4" />,
    label: resource.type,
    color: "text-slate-300",
    bg: "bg-slate-500/15 border-slate-500/30",
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-4 backdrop-blur-sm",
        config.bg,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg bg-slate-800/60 flex-shrink-0", config.color)}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                  config.bg,
                  config.color
                )}
              >
                {config.label}
              </span>
              <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">
                {resource.name}
              </h4>
            </div>
            <span
              className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
                resource.isOperational
                  ? "text-green-400 bg-green-500/15"
                  : "text-red-400 bg-red-500/15"
              )}
            >
              {resource.isOperational ? "● Operational" : "● Inactive"}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1">{resource.locationName}, {resource.state}</p>
          <p className="text-xs text-slate-500 mt-0.5">{resource.address}</p>

          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
            <p className="text-xs text-amber-400 font-medium">{resource.contactDemo}</p>
            {resource.capacity && (
              <p className="text-xs text-slate-500">Capacity: {resource.capacity.toLocaleString("en-IN")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
