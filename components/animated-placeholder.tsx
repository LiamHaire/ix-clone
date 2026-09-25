"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "How can I help you?",
  "What would you like to do today?",
  "Type / for skills",
];

type Phase = "visible" | "exit" | "enter";

export function AnimatedPlaceholder({ show }: { show: boolean }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("visible");

  useEffect(() => {
    if (!show) return;

    // Stay visible for 8s, then roll up over 400ms, then fade in next over 400ms
    const visibleTimer = setTimeout(() => {
      setPhase("exit");

      const exitTimer = setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setPhase("enter");

        const enterTimer = setTimeout(() => {
          setPhase("visible");
        }, 400);

        return () => clearTimeout(enterTimer);
      }, 400);

      return () => clearTimeout(exitTimer);
    }, 6000);

    return () => clearTimeout(visibleTimer);
  }, [index, phase, show]);

  if (!show) return null;

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute select-none"
      style={{
        top: "20px",
        left: "20px",
        fontSize: "16px",
        fontFamily: "var(--font-geist-sans, sans-serif)",
        fontWeight: 400,
        color: "var(--muted-foreground)",
        lineHeight: "1.5",
        transition:
          phase === "exit"
            ? "transform 400ms cubic-bezier(0.4,0,1,1), opacity 400ms ease"
            : phase === "enter"
            ? "none"
            : "none",
        transform:
          phase === "exit" ? "translateY(-8px)" : "translateY(0px)",
        opacity: phase === "exit" ? 0 : phase === "enter" ? 0 : 1,
        animation: phase === "enter" ? "ph-fade-in 400ms ease forwards" : "none",
      }}
    >
      {PHRASES[index]}
      <style>{`
        @keyframes ph-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </span>
  );
}
