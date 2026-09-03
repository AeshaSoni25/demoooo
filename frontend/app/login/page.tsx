"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AlertCircle, Loader, Eye, EyeOff, Mountain } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      // Redirect to dashboard after successful login/register
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@landslide-guard.com");
    setPassword("Demo@123");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #03071a 0%, #0a0e27 50%, #050f2e 100%)",
      }}
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(at 40% 20%, hsla(217,100%,60%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.10) 0px, transparent 50%)",
        }}
      />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="p-3 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
                boxShadow: "0 0 20px rgba(79,70,229,0.4)",
              }}
            >
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              LandslideGuard AI
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            AI-Powered Landslide Early Warning System
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl border backdrop-blur-xl p-8 space-y-6"
          style={{
            background: "rgba(8, 15, 42, 0.6)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {/* Error message */}
          {error && (
            <div
              className="flex items-start gap-3 p-4 rounded-lg border"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                borderColor: "rgba(239, 68, 68, 0.3)",
              }}
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input (Only for registering) */}
            {isRegistering && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required={isRegistering}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-100 placeholder-slate-600 transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(99, 102, 241, 0.5)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(99, 102, 241, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(99, 102, 241, 0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRegistering ? "your@email.com" : "admin@landslide-guard.com"}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-100 placeholder-slate-600 transition-all duration-200 disabled:opacity-50"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(99, 102, 241, 0.5)";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(99, 102, 241, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(99, 102, 241, 0.2)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg text-sm font-medium text-slate-100 placeholder-slate-600 transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(99, 102, 241, 0.5)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(99, 102, 241, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(99, 102, 241, 0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: isSubmitting
                  ? "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)"
                  : "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
                boxShadow: isSubmitting
                  ? "0 1px 0 rgba(255,255,255,0.1) inset, 0 4px 16px rgba(79,70,229,0.35)"
                  : "0 1px 0 rgba(255,255,255,0.1) inset, 0 4px 16px rgba(79,70,229,0.35)",
                opacity: isSubmitting ? 0.9 : 1,
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  {isRegistering ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                isRegistering ? "Create Demo Account" : "Sign In"
              )}
            </button>
          </form>

          {/* Demo Credentials Helper */}
          <div className="pt-4 border-t border-slate-700/50 flex flex-col gap-3">
            {!isRegistering && (
              <button
                type="button"
                onClick={fillDemoCredentials}
                disabled={isSubmitting}
                className="w-full px-4 py-2 rounded-lg text-xs font-medium text-indigo-400 hover:text-indigo-300 border transition-all duration-200 disabled:opacity-50"
                style={{
                  background: "rgba(99, 102, 241, 0.05)",
                  borderColor: "rgba(99, 102, 241, 0.2)",
                }}
              >
                Fill Default Demo Credentials
              </button>
            )}
            
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
                if (!isRegistering) {
                   setEmail("");
                   setPassword("");
                }
              }}
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all duration-200 disabled:opacity-50 text-center"
            >
              {isRegistering ? "Back to Login" : "Or Create Your Own Demo Credentials"}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        {!isRegistering && (
          <div className="mt-8 text-center text-xs text-slate-500 space-y-2">
            <p>
              For demo purposes, use:
            </p>
            <div
              className="p-3 rounded-lg font-mono text-[11px] text-slate-400"
              style={{
                background: "rgba(99, 102, 241, 0.05)",
                border: "1px solid rgba(99, 102, 241, 0.1)",
              }}
            >
              <div>admin@landslide-guard.com</div>
              <div>Demo@123</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
