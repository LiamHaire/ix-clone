'use client';

import { useEffect, useRef, useState } from 'react';

const PHRASES = [
  'Thinking...',
  'Analysing...',
  'Fetching...',
  'Building...',
  'Processing...',
  'Searching...',
  'Working on it...',
  'Almost there...',
];

function TwinkleGrid() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const POSITIONS: [number, number][] = [
      [6, 6],  [12, 6],  [18, 6],
      [6, 12], [12, 12], [18, 12],
      [6, 18], [12, 18], [18, 18],
    ];

    const lit = new Set([0, 4, 8]);

    const circles = POSITIONS.map(([cx, cy]) => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', String(cx));
      c.setAttribute('cy', String(cy));
      c.setAttribute('r', '2');
      c.style.transition = 'fill 130ms ease';
      svg.appendChild(c);
      return c;
    });

    function paint() {
      circles.forEach((c, i) =>
        c.setAttribute('fill', lit.has(i) ? 'var(--muted-foreground)' : 'var(--border)')
      );
    }

    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      timer = setTimeout(() => {
        const litArr = [...lit];
        const unlitArr = circles.map((_, i) => i).filter(i => !lit.has(i));
        const off = litArr[Math.floor(Math.random() * litArr.length)];
        const on  = unlitArr[Math.floor(Math.random() * unlitArr.length)];
        lit.delete(off);
        lit.add(on);
        paint();
        tick();
      }, 120 + Math.random() * 360);
    }

    requestAnimationFrame(() => { paint(); tick(); });
    return () => { clearTimeout(timer); circles.forEach(c => c.remove()); };
  }, []);

  return (
    <svg
      ref={svgRef}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    />
  );
}

type Phase = 'visible' | 'exit' | 'enter';

export function ThinkingText() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('visible');

  useEffect(() => {
    const id = setInterval(() => {
      setPhase('exit');
      setTimeout(() => {
        setIndex(prev => (prev + 1) % PHRASES.length);
        setPhase('enter');
        setTimeout(() => setPhase('visible'), 250);
      }, 250);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="thinking-row">
      <TwinkleGrid />
      <span
        className="thinking-shimmer-text text-sm"
        style={{
          opacity: phase === 'exit' ? 0 : phase === 'enter' ? 0 : 1,
          transform: phase === 'exit' ? 'translateY(-4px)' : phase === 'enter' ? 'translateY(4px)' : 'translateY(0)',
          transition: phase === 'visible' ? 'opacity 250ms ease, transform 250ms ease' : 'none',
        }}
      >
        {PHRASES[index]}
      </span>
    </div>
  );
}
