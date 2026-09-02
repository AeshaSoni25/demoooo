"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { DemoStep } from "@/types";

// Demo simulation steps
const DEMO_STEPS: DemoStep[] = [
  {
    step: 0,
    label: "Baseline",
    rainfall: 80,
    riskScore: 42,
    riskLevel: "MODERATE",
    soilMoisture: 58,
    groundMovement: 1.8,
    alertGenerated: false,
  },
  {
    step: 1,
    label: "Rainfall Increasing",
    rainfall: 120,
    riskScore: 58,
    riskLevel: "MODERATE",
    soilMoisture: 68,
    groundMovement: 2.4,
    alertGenerated: false,
  },
  {
    step: 2,
    label: "Heavy Rainfall",
    rainfall: 160,
    riskScore: 72,
    riskLevel: "HIGH",
    soilMoisture: 80,
    groundMovement: 4.2,
    alertGenerated: false,
  },
  {
    step: 3,
    label: "Critical Conditions",
    rainfall: 210,
    riskScore: 87,
    riskLevel: "CRITICAL",
    soilMoisture: 94,
    groundMovement: 7.8,
    alertGenerated: true,
  },
];

interface DemoModeContextValue {
  isDemo: boolean;
  toggleDemo: () => void;
  currentStep: DemoStep;
  stepIndex: number;
  nextStep: () => void;
  resetDemo: () => void;
  isRunning: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
}

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = DEMO_STEPS[stepIndex] ?? DEMO_STEPS[0];

  const toggleDemo = useCallback(() => {
    setIsDemo((prev) => !prev);
    setStepIndex(0);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const nextStep = useCallback(() => {
    setStepIndex((prev) => Math.min(prev + 1, DEMO_STEPS.length - 1));
  }, []);

  const resetDemo = useCallback(() => {
    setStepIndex(0);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const startSimulation = useCallback(() => {
    setIsRunning(true);
    setStepIndex(0);
    let step = 0;
    intervalRef.current = setInterval(() => {
      step += 1;
      if (step >= DEMO_STEPS.length) {
        setIsRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      setStepIndex(step);
    }, 3000);
  }, []);

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <DemoModeContext.Provider
      value={{
        isDemo,
        toggleDemo,
        currentStep,
        stepIndex,
        nextStep,
        resetDemo,
        isRunning,
        startSimulation,
        stopSimulation,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode(): DemoModeContextValue {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error("useDemoMode must be used within DemoModeProvider");
  return ctx;
}
