"use client";

import { useEffect, useRef } from "react";
import {
  TITLE_STAGGER_MS,
  TITLE_CHAR_MS,
  TITLE_HOLD_MS,
  TITLE_DOT_MS,
  TITLE_LETTER_KEYFRAMES,
  TITLE_DOT_KEYFRAMES,
} from "@/lib/motion";

interface TitleBounceProps {
  text: string;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function TitleBounce({ text, animate = true, className = "", style }: TitleBounceProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!animate || !el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("tb-static");
      return;
    }

    const chars = el.querySelectorAll<HTMLElement>(".tb-ch");
    const dot = el.querySelector<HTMLElement>(".tb-dot");
    const anims: Animation[] = [];

    chars.forEach((s, i) => {
      anims.push(
        s.animate(TITLE_LETTER_KEYFRAMES, {
          duration: TITLE_CHAR_MS,
          delay: i * TITLE_STAGGER_MS * (0.92 + Math.random() * 0.16),
          easing: "ease-out",
          fill: "both",
        })
      );
    });

    const timer = setTimeout(() => {
      if (dot) anims.push(dot.animate(TITLE_DOT_KEYFRAMES, { duration: TITLE_DOT_MS, fill: "forwards" }));
    }, chars.length * TITLE_STAGGER_MS + TITLE_CHAR_MS + TITLE_HOLD_MS);

    return () => {
      clearTimeout(timer);
      anims.forEach((a) => a.cancel());
    };
  }, [animate, text]);

  return (
    <h1
      ref={ref}
      aria-label={`${text}.`}
      className={`tb-line ${animate ? "" : "tb-static"} ${className}`}
      style={style}
    >
      {[...text].map((c, i) => (
        <span key={i} className="tb-ch" aria-hidden="true">
          {c}
        </span>
      ))}
      <span className="tb-dot" aria-hidden="true" />
    </h1>
  );
}
