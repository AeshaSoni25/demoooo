"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AppShellProps { children: ReactNode; title?: string; className?: string; }

export function AppShell({ children, title, className }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen flex" style={{ background:"#03071a" }}>
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true"
        style={{ background:"radial-gradient(ellipse 70% 40% at 30% 0%, rgba(79,70,229,0.06) 0%, transparent 60%)", zIndex:0 }} />
      <div className="fixed inset-0 bg-grid-subtle pointer-events-none" aria-hidden="true" style={{ zIndex:0 }} />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 relative" style={{ zIndex:1 }}>
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <motion.main 
          key={pathname}
          className={cn("flex-1 overflow-auto p-4 md:p-5 lg:p-6", className)} 
          id="main-content" 
          tabIndex={-1}
          initial={{ opacity: 0, y: 15, scale: 0.99, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ 
            duration: 0.5, 
            ease: [0.23, 1, 0.32, 1], // Custom easing for a snappy, premium feel (easeOutQuint)
            staggerChildren: 0.1
          }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
