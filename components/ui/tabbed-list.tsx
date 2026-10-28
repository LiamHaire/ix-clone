'use client';

import { useRef, useLayoutEffect, useState } from 'react';
import { Tabs } from '@base-ui/react/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TabbedListTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  items: React.ReactNode;
}

export interface TabbedListProps {
  title: string;
  subtitle?: string;
  tabs: TabbedListTab[];
  defaultTab?: string;
  footer?: React.ReactNode;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TabbedList({
  title,
  subtitle,
  tabs,
  defaultTab,
  footer,
  className,
}: TabbedListProps) {
  const measureRefs      = useRef<Map<string, HTMLDivElement>>(new Map());
  const measureContainer = useRef<HTMLDivElement>(null);
  const sentinelRef      = useRef<HTMLDivElement>(null);
  const [panelMinHeight, setPanelMinHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const measure = () => {
      const width = sentinel.offsetWidth;
      if (!width || !measureContainer.current) return;
      // Set width directly so clones render at the right size before measuring
      measureContainer.current.style.width = `${width}px`;
      let max = 0;
      measureRefs.current.forEach(el => { if (el) max = Math.max(max, el.offsetHeight); });
      if (max > 0) setPanelMinHeight(prev => (prev === max ? prev : max));
    };

    measure();
    // Re-measure when the available width changes (panel resizes, late layout)
    const observer = new ResizeObserver(measure);
    observer.observe(sentinel);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  return (
    <Card className={cn('relative', className)}>
      {/* Hidden measurement clones — fixed position escapes overflow:hidden */}
      <div
        ref={measureContainer}
        aria-hidden="true"
        style={{ position: 'fixed', top: '-9999px', left: 0, visibility: 'hidden', pointerEvents: 'none', width: 0 }}
      >
        {tabs.map(tab => (
          <div
            key={tab.id}
            ref={el => { if (el) measureRefs.current.set(tab.id, el); }}
            className="flex flex-col gap-2"
          >
            {tab.items}
          </div>
        ))}
      </div>

      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* Sentinel — measures available content width for fixed-position clones */}
        <div ref={sentinelRef} className="w-full h-0" aria-hidden="true" />
        <Tabs.Root defaultValue={defaultTab ?? tabs[0]?.id} className="flex flex-col gap-3">
          <Tabs.List className="relative flex w-full rounded-lg bg-muted p-1 gap-0.5">
            {tabs.map(tab => (
              <Tabs.Tab
                key={tab.id}
                value={tab.id}
                className={cn(
                  'relative z-10 flex-1 rounded-md px-3 py-1.5 text-sm font-medium',
                  'transition-colors outline-none',
                  'text-muted-foreground hover:text-foreground',
                  'data-[active]:text-primary-foreground',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                )}
              >
                <span className="flex items-center justify-center gap-1.5">
                  {tab.icon && <span className="[&_svg]:size-icon-sm flex items-center">{tab.icon}</span>}
                  {tab.label}
                </span>
              </Tabs.Tab>
            ))}
            <Tabs.Indicator
              className="absolute top-1 bottom-1 rounded-md bg-primary shadow-sm"
              style={{
                left: 'var(--active-tab-left)',
                width: 'var(--active-tab-width)',
                transition: 'left var(--dur-tabs-indicator) var(--ease-out-expo), width var(--dur-tabs-indicator) var(--ease-out-expo)',
              }}
            />
          </Tabs.List>

          <div style={panelMinHeight ? { minHeight: panelMinHeight } : undefined}>
            {tabs.map(tab => (
              <Tabs.Panel
                key={tab.id}
                value={tab.id}
                className="flex flex-col gap-2 outline-none"
              >
                {tab.items}
              </Tabs.Panel>
            ))}
          </div>
        </Tabs.Root>
      </CardContent>

      {footer && (
        <CardFooter className="justify-end">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
