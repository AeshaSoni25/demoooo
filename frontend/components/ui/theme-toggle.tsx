"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Initialize on mount
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (systemDark ? "dark" : "light");
    console.log("[ThemeToggle] Init - stored:", stored, "systemDark:", systemDark, "initial:", initial);
    setThemeState(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    console.log("[ThemeToggle] Applying theme:", newTheme);
    const html = document.documentElement;
    const body = document.body;
    
    // Clear both classes first
    html.classList.remove("light", "dark");
    body.classList.remove("light", "dark");
    
    // Add the appropriate class
    if (newTheme === "light") {
      html.classList.add("light");
      body.classList.add("light");
      html.style.colorScheme = "light";
      // Direct inline style override for testing
      body.style.backgroundColor = "#ffffff";
      body.style.color = "#0f172a";
    } else {
      html.classList.add("dark");
      body.classList.add("dark");
      html.style.colorScheme = "dark";
      // Direct inline style override for testing
      body.style.backgroundColor = "#03071a";
      body.style.color = "#f1f5f9";
    }
    
    console.log("[ThemeToggle] HTML classes:", html.className, "Body classes:", body.className);
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    console.log("[ThemeToggle] Toggle clicked, current theme:", theme);
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("[ThemeToggle] New theme:", newTheme);
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div
        className="w-10 h-10 rounded-full"
        style={{
          background: "rgba(99, 102, 241, 0.1)",
          border: "1px solid var(--border-soft)",
        }}
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-out hover:scale-110 active:scale-95"
      style={{
        background: "rgba(99, 102, 241, 0.1)",
        border: "1px solid var(--border-soft)",
      }}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      type="button"
    >
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ease-out ${
          theme === "dark"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-0"
        }`}
        style={{
          background: "rgba(59, 130, 246, 0.15)",
          boxShadow: "0 0 16px rgba(59, 130, 246, 0.25)",
        }}
      />

      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-amber-400 relative z-10" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 relative z-10" />
      )}
    </button>
  );
}
