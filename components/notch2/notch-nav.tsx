'use client';

import {
  ClockCounterClockwise,
  ListChecks,
  Bell,
  SquaresFour,
  Microphone,
  Gear,
  Plus,
} from '@phosphor-icons/react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { cn } from '@/lib/utils';
import { CSS } from '@/lib/motion';

// ── NAV_ITEMS config ── add/remove items here only ───────────────────────────

export type NavId = 'recent' | 'tasks' | 'notifications' | 'apps' | 'record' | 'settings' | 'profile';

export interface NavItem {
  id: NavId;
  label: string;
  icon: React.ElementType;
  position: 'left' | 'right';
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'notifications', label: 'Notifications',   icon: Bell,                  position: 'left' },
  { id: 'recent',        label: 'Session history', icon: ClockCounterClockwise, position: 'left' },
  { id: 'tasks',         label: 'Work',            icon: ListChecks,            position: 'left' },
  { id: 'apps',          label: 'Apps',            icon: SquaresFour,           position: 'left' },
  { id: 'record',        label: 'Start Scribe',    icon: Microphone,            position: 'right' },
  { id: 'settings',      label: 'Settings',        icon: Gear,                  position: 'right' },
];

// ── Header component ──────────────────────────────────────────────────────────

interface NotchHeaderProps {
  activeId: NavId | null;
  onSelect: (id: NavId) => void;
  isRecording?: boolean;
  onUpload?: () => void;
}

export function NotchHeader({ activeId, onSelect, isRecording = false, onUpload }: NotchHeaderProps) {
  const left  = NAV_ITEMS.filter((i) => i.position === 'left');
  const right = NAV_ITEMS.filter((i) => i.position === 'right');

  return (
    <div
      role="toolbar"
      aria-label="Notch navigation"
      className="flex items-center justify-between px-3 h-11 shrink-0 border-b border-border"
    >
      {/* Left group */}
      <div className="flex items-center gap-0.5">
        {left.map((item) => (
          <NavButton key={item.id} item={item} active={activeId === item.id} onSelect={onSelect} />
        ))}
      </div>

      {/* Centre gap — visual only */}
      <div className="flex-1" />

      {/* Right group */}
      <div className="flex items-center gap-0.5">
        {right.map((item) => (
          <NavButton key={item.id} item={item} active={activeId === item.id} onSelect={onSelect} recording={item.id === 'record' && isRecording} />
        ))}
        {onUpload && (
          <NotchTooltip label="Add to Knowledge base">
            <TooltipPrimitive.Trigger
              aria-label="Add to Knowledge base"
              onClick={onUpload}
              className="flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ transition: `background-color ${CSS.durFast} ${CSS.easeOutCubic}, color ${CSS.durFast} ${CSS.easeOutCubic}` }}
            >
              <Plus size={18} />
            </TooltipPrimitive.Trigger>
          </NotchTooltip>
        )}
        <AvatarButton active={activeId === 'profile'} onSelect={onSelect} />
      </div>
    </div>
  );
}

function NotchTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <TooltipPrimitive.Root delay={600} closeDelay={200}>
      {children}
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side="bottom" sideOffset={6} className="z-[10000]">
          <TooltipPrimitive.Popup className="inline-flex items-center rounded-md bg-foreground px-3 py-1.5 text-xs text-background origin-(--transform-origin) data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2">
            {label}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

function NavButton({ item, active, onSelect, recording = false }: { item: NavItem; active: boolean; onSelect: (id: NavId) => void; recording?: boolean }) {
  const Icon = item.icon;
  const tooltipLabel = item.id === 'record' && recording ? 'Stop Scribe' : item.label;
  return (
    <NotchTooltip label={tooltipLabel}>
      <TooltipPrimitive.Trigger
        aria-label={tooltipLabel}
        aria-pressed={active}
        onClick={() => onSelect(item.id)}
        className={cn(
          'relative flex items-center justify-center size-8 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'text-muted-foreground hover:text-foreground',
          recording && 'text-destructive! hover:text-destructive!',
        )}
        style={{
          transition: `background-color ${CSS.durFast} ${CSS.easeOutCubic}, color ${CSS.durFast} ${CSS.easeOutCubic}`,
          backgroundColor: active ? 'var(--accent)' : 'transparent',
          color: active ? 'var(--foreground)' : undefined,
        }}
      >
        <Icon size={18} weight={recording ? 'fill' : active ? 'duotone' : 'regular'} />
        {recording && (
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-destructive animate-pulse" />
        )}
      </TooltipPrimitive.Trigger>
    </NotchTooltip>
  );
}

function AvatarButton({ active, onSelect }: { active: boolean; onSelect: (id: NavId) => void }) {
  return (
    <NotchTooltip label="Liam Haire">
      <TooltipPrimitive.Trigger
        aria-label="Liam Haire"
        aria-pressed={active}
        onClick={() => onSelect('profile')}
        className={cn(
          'flex items-center justify-center size-8 rounded-full text-[11px] font-semibold ml-0.5',
          'border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          active
            ? 'bg-accent text-foreground'
            : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
        )}
        style={{ transition: `background-color ${CSS.durFast} ${CSS.easeOutCubic}, color ${CSS.durFast} ${CSS.easeOutCubic}` }}
      >
        LH
      </TooltipPrimitive.Trigger>
    </NotchTooltip>
  );
}
