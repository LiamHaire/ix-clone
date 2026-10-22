'use client';

import {
  Bell,
  ListChecks,
  CalendarBlank,
  Microphone,
  Plus,
  User,
  Gear,
  SignOut,
} from '@phosphor-icons/react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CSS } from '@/lib/motion';

// ── NAV_ITEMS config ──────────────────────────────────────────────────────────

export type NavId3 = 'notifications' | 'tasks' | 'calendar' | 'record' | 'knowledge';

export interface NavItem3 {
  id: NavId3;
  label: string;
  icon: React.ElementType;
  position: 'left' | 'right';
}

export const NAV_ITEMS_3: NavItem3[] = [
  { id: 'notifications', label: 'Notifications',         icon: Bell,          position: 'left'  },
  { id: 'calendar',      label: 'Calendar events',        icon: CalendarBlank, position: 'left'  },
  { id: 'tasks',         label: "Today's Tasks",          icon: ListChecks,    position: 'left'  },
  { id: 'record',        label: 'Start Scribe',           icon: Microphone,    position: 'right' },
  { id: 'knowledge',     label: 'Add to Knowledge base',  icon: Plus,          position: 'right' },
];

// ── Header ────────────────────────────────────────────────────────────────────

interface Notch3HeaderProps {
  activeId: NavId3 | null;
  onSelect: (id: NavId3) => void;
  isRecording?: boolean;
}

export function Notch3Header({ activeId, onSelect, isRecording = false }: Notch3HeaderProps) {
  const left  = NAV_ITEMS_3.filter(i => i.position === 'left');
  const right = NAV_ITEMS_3.filter(i => i.position === 'right');

  return (
    <div
      role="toolbar"
      aria-label="Notch 3 navigation"
      className="flex items-center justify-between px-4 h-11 shrink-0"
    >
      {/* Left group */}
      <div className="flex items-center gap-0.5">
        {left.map(item => (
          <NavBtn3 key={item.id} item={item} active={activeId === item.id} onSelect={onSelect} />
        ))}
      </div>

      {/* Centre gap */}
      <div className="flex-1" />

      {/* Right group */}
      <div className="flex items-center gap-0.5">
        {right.map(item => (
          <NavBtn3
            key={item.id}
            item={item}
            active={activeId === item.id}
            onSelect={onSelect}
            recording={item.id === 'record' && isRecording}
          />
        ))}
        <AvatarBtn3 />
      </div>
    </div>
  );
}

// ── Tooltip wrapper ───────────────────────────────────────────────────────────

function N3Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
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

// ── Nav button ────────────────────────────────────────────────────────────────

function NavBtn3({ item, active, onSelect, recording = false }: {
  item: NavItem3;
  active: boolean;
  onSelect: (id: NavId3) => void;
  recording?: boolean;
}) {
  const Icon = item.icon;
  const label = item.id === 'record' && recording ? 'Stop Scribe' : item.label;
  return (
    <N3Tooltip label={label}>
      <TooltipPrimitive.Trigger
        aria-label={label}
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
    </N3Tooltip>
  );
}

// ── Avatar button ─────────────────────────────────────────────────────────────

function AvatarBtn3() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Liam Haire"
        className={cn(
          'flex items-center justify-center size-8 rounded-full text-[11px] font-semibold ml-0.5',
          'border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
        )}
        style={{ transition: `background-color ${CSS.durFast} ${CSS.easeOutCubic}, color ${CSS.durFast} ${CSS.easeOutCubic}` }}
      >
        LH
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" sideOffset={8} className="w-52">
        <div className="px-2 py-1.5 font-normal">
          <p className="text-sm font-medium text-foreground">Liam Haire</p>
          <p className="text-xs text-muted-foreground">l.haire@oneadvanced.com</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2">
            <User size={14} className="text-muted-foreground" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Gear size={14} className="text-muted-foreground" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
          <SignOut size={14} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
