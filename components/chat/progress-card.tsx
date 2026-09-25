'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressCardProps {
  onComplete: () => void;
}

const STEPS = [
  { label: 'Create task', delay: 400, duration: 3000 },
  { label: 'Diarise deadline', delay: 400, duration: 1000 },
];

export function ProgressCard({ onComplete }: ProgressCardProps) {
  const [values, setValues] = useState([0, 0]);
  const firedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => {
        setValues(prev => {
          const next = [...prev];
          next[i] = 100;
          return next;
        });
      }, step.delay));
    });

    const allDone = Math.max(...STEPS.map(s => s.delay + s.duration));
    timers.push(setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        onCompleteRef.current();
      }
    }, allDone + 1000));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>Create task and diarise the deadline</CardTitle>
        <CardDescription>In progress</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-4">
        {STEPS.map((step, i) => (
          <Progress
            key={step.label}
            label={step.label}
            value={values[i]}
            duration={step.duration}
          />
        ))}
      </CardContent>
    </Card>
  );
}
