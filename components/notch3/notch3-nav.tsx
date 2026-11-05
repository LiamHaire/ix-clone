'use client';

import {
  Bell,
  ListChecks,
  CalendarBlank,
  Microphone,
  Plus,
  Gear,
} from '@phosphor-icons/react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { cn } from '@/lib/utils';
import { CSS } from '@/lib/motion';
import { Mail } from '@/components/ui/iqons/Mail';

// ── NAV_ITEMS config ──────────────────────────────────────────────────────────

export type NavId3 = 'notifications' | 'chat' | 'tasks' | 'calendar';

export interface NavItem3 {
  id: NavId3;
  label: string;
  icon: React.ElementType;
  iqon?: boolean;
  position: 'left' | 'right';
}

export const NAV_ITEMS_3: NavItem3[] = [
  { id: 'tasks',         label: "Today's Tasks",   icon: ListChecks,    position: 'left'  },
  { id: 'notifications', label: 'Notifications',   icon: Bell,          position: 'left'  },
  { id: 'chat',          label: 'Mail',            icon: Mail, iqon: true, position: 'left'  },
  { id: 'calendar',      label: 'Calendar events', icon: CalendarBlank, position: 'left'  },
];

// ── Header ────────────────────────────────────────────────────────────────────

interface Notch3HeaderProps {
  activeId: NavId3 | null;
  onSelect: (id: NavId3) => void;
  onOpenSettings: () => void;
  onToggleScribe: () => void;
  onAddToKnowledge: () => void;
  isRecording?: boolean;
}

const SETTINGS_ITEM = { id: 'settings', label: 'Settings', icon: Gear };
const SCRIBE_ITEM = { id: 'scribe', label: 'Start Scribe', icon: Microphone };
const KNOWLEDGE_ITEM = { id: 'knowledge', label: 'Add to Knowledge base', icon: Plus };

export function Notch3Header({ activeId, onSelect, onOpenSettings, onToggleScribe, onAddToKnowledge, isRecording = false }: Notch3HeaderProps) {
  const left = NAV_ITEMS_3.filter(i => i.position === 'left');

  return (
    <div
      role="toolbar"
      aria-label="Notch 3 navigation"
      className="flex items-center justify-between px-4 h-11 shrink-0"
    >
      {/* Left group */}
      <div className="flex items-center gap-0.5">
        {left.map(item => (
          <NavBtn3 key={item.id} item={item} active={activeId === item.id} onPress={() => onSelect(item.id)} />
        ))}
      </div>

      {/* Centre gap */}
      <div className="flex-1" />

      {/* Right group */}
      <div className="flex items-center gap-0.5">
        <NavBtn3
          item={isRecording ? { ...SCRIBE_ITEM, label: 'Stop Scribe' } : SCRIBE_ITEM}
          onPress={onToggleScribe}
          recording={isRecording}
        />
        <NavBtn3 item={KNOWLEDGE_ITEM} onPress={onAddToKnowledge} />
        <NavBtn3 item={SETTINGS_ITEM} onPress={onOpenSettings} />
      </div>
    </div>
  );
}

// ── Tooltip wrapper ───────────────────────────────────────────────────────────

export function N3Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <TooltipPrimitive.Root>
      {children}
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side="bottom" sideOffset={6} className="z-[10000]">
          <TooltipPrimitive.Popup className="inline-flex items-center rounded-md bg-foreground px-3 py-1.5 text-xs text-background origin-(--transform-origin) data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2">
            {label}
            <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1" />
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

// ── Nav button ────────────────────────────────────────────────────────────────

function NavBtn3({ item, active, onPress, recording = false }: {
  item: { id: string; label: string; icon: React.ElementType; iqon?: boolean };
  active?: boolean;
  onPress: () => void;
  recording?: boolean;
}) {
  const Icon = item.icon;
  const label = item.label;
  return (
    <N3Tooltip label={label}>
      <TooltipPrimitive.Trigger
        delay={600}
        closeDelay={200}
        aria-label={label}
        aria-pressed={active}
        onClick={onPress}
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
        {item.iqon ? (
          <Icon size={18} variant={active ? 'duotone' : 'outline'} />
        ) : (
          <Icon size={18} weight={recording ? 'fill' : active ? 'duotone' : 'regular'} />
        )}
        {recording && (
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-destructive animate-pulse" />
        )}
      </TooltipPrimitive.Trigger>
    </N3Tooltip>
  );
}
