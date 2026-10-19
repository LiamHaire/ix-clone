'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  ClockCounterClockwise,
  Gear,
  X,
  MagnifyingGlass,
  Bell,
  BellRinging,
  CalendarBlank,
  ListChecks,
  Warning,
  ChartBar,
  Heartbeat,
  Monitor,
  Microphone,
  Books,
  Info,
  User,
  SignOut,
  FileText,
  CheckCircle,
} from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { MOCK_SESSIONS } from '@/components/chat/session-history-list';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MOCK_EVENTS, MOCK_TODAY_TASKS, formatRelative, type IslandEvent } from './island-mock-events';

// ── Types ────────────────────────────────────────────────────────────────────

type NotchState = 'idle' | 'event' | 'expanded';

interface NavNotchProps {
  onSessionHistory?: () => void;
  onWork?: () => void;
  onSettings?: () => void;
  onMedicationReview?: () => void;
  onFileReview?: () => void;
}

// ── Event icon map ────────────────────────────────────────────────────────────

function EventIcon({ type, size = 20 }: { type: IslandEvent['type']; size?: number }) {
  if (type === 'appointment') return <CalendarBlank size={size} weight="regular" />;
  if (type === 'task') return <ListChecks size={size} weight="regular" />;
  if (type === 'alert') return <Warning size={size} weight="regular" />;
  return <Bell size={size} weight="regular" />;
}


// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function formatSessionDate(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const sessionDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  if (sessionDay.getTime() === today.getTime()) return `Today ${hh}:${mm}`;
  if (sessionDay.getTime() === yesterday.getTime()) return `Yesterday ${hh}:${mm}`;
  return `${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()]}`;
}


// ── Expanded panel ────────────────────────────────────────────────────────────

function ExpandedPanel({
  events,
  onClose,
  onSessionHistory,
  onWork,
  onSettings,
  onMarkRead,
  onMedicationReview,
  onFileReview,
}: {
  events: IslandEvent[];
  onClose: () => void;
  onSessionHistory?: () => void;
  onWork?: () => void;
  onSettings?: () => void;
  onMarkRead: (id: string) => void;
  onMedicationReview?: () => void;
  onFileReview?: () => void;
}) {
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus search on open
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const unread = events.filter((e) => !e.read);
  const filtered = search
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.preview?.toLowerCase().includes(search.toLowerCase()),
      )
    : events;

  const APP_TILES = [
    { label: 'Calendar',        icon: CalendarBlank },
    { label: 'Reporting',       icon: ChartBar      },
    { label: 'IQ Health',       icon: Heartbeat     },
    { label: 'Admin',           icon: Monitor       },
    { label: 'Scribe',          icon: Microphone    },
    { label: 'Knowledge',  icon: Books         },
  ];

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Global navigation"
      aria-modal="false"
      className="w-full"
    >
      {/* Toolbar row */}
      <div className="relative flex items-center px-3 pt-3 pb-2 border-b border-border" style={{ minHeight: 48 }}>
        {/* Left: avatar dropdown + nav actions */}
        <div className="flex items-center gap-1 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Liam Haire"
              className="flex items-center justify-center size-8 rounded-full bg-muted border border-border text-[11px] font-semibold text-muted-foreground hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            >
              LH
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" sideOffset={8} className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium text-foreground">Liam Haire</p>
                  <p className="text-xs text-muted-foreground">l.haire@oneadvanced.com</p>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-2">
                  <User size={15} className="text-muted-foreground" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={() => { onSettings?.(); onClose(); }}>
                  <Gear size={15} className="text-muted-foreground" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                  <SignOut size={15} />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <NavAction label="Work" onClick={() => { onWork?.(); onClose(); }}>
            <ListChecks size={16} weight="duotone" />
          </NavAction>
          <NavAction label="Session history" onClick={() => { onSessionHistory?.(); onClose(); }}>
            <ClockCounterClockwise size={16} weight="duotone" />
          </NavAction>
          <NavAction label="Info">
            <Info size={16} weight="duotone" />
          </NavAction>
          <NavAction label="Settings" onClick={() => { onSettings?.(); onClose(); }}>
            <Gear size={16} weight="duotone" />
          </NavAction>
        </div>

        {/* Centre: search — absolutely centred to the toolbar */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 h-8 rounded-full border border-border bg-background px-3" style={{ width: 360 }}>
          <MagnifyingGlass size={13} className="text-muted-foreground shrink-0" />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for something…"
            className="flex-1 text-[13px] text-foreground placeholder:text-muted-foreground bg-transparent outline-none min-w-0"
          />
        </div>

        {/* Right: close */}
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger
            aria-label="Close navigation"
            onClick={onClose}
            className="ml-auto flex items-center justify-center size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
          >
            <X size={15} />
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Positioner side="bottom" sideOffset={4} style={{ zIndex: 200 }}>
              <TooltipPrimitive.Popup className="inline-flex items-center rounded-md bg-foreground px-3 py-1.5 text-xs text-background animate-in fade-in-0 zoom-in-95">
                Close
              </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </div>

      {/* Body */}
      <div className="flex gap-3 p-3 items-stretch">

        {/* Recent sessions widget */}
        <div className="flex-1 min-w-0 flex flex-col rounded-xl border border-border bg-background overflow-hidden">
          <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-border">
            <p className="text-[11px] font-semibold text-muted-foreground">Recent sessions</p>
            <button type="button" onClick={() => { onSessionHistory?.(); onClose(); }} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">View all</button>
          </div>
          <div className="flex flex-col gap-0 flex-1">
            {MOCK_SESSIONS.slice(0, 3).map((session, i) => (
              <button
                key={session.id}
                type="button"
                className={cn(
                  'flex items-center gap-3 w-full text-left px-3 py-2.5 hover:bg-accent transition-colors group',
                  i < 2 && 'border-b border-border',
                )}
              >
                <span className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-[13px] font-medium text-foreground truncate">{session.title}</span>
                  <span className="text-[11px] text-muted-foreground truncate">
                    {session.subtitle}<span className="mx-1.5">·</span>{session.itemCount} items
                  </span>
                </span>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                  {formatSessionDate(session.isoDate)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications widget */}
        <div className="flex-1 min-w-0 flex flex-col rounded-xl border border-border bg-background overflow-hidden">
          <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-border">
            <p className="text-[11px] font-semibold text-muted-foreground">Notifications</p>
            <button type="button" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">View all</button>
          </div>
          <div className="flex flex-col flex-1">
            {(search ? filtered : unread.length > 0 ? unread : events.slice(0, 3)).map((event, i, arr) => (
              <button
                key={event.id}
                type="button"
                onClick={() => {
                  onMarkRead(event.id);
                  if (event.title.toLowerCase().includes('file review')) { onFileReview?.(); onClose(); }
                }}
                className={cn(
                  'flex flex-col gap-0.5 w-full text-left px-3 py-2.5 hover:bg-accent transition-colors',
                  i < arr.length - 1 && 'border-b border-border',
                )}
              >
                <div className="flex items-center gap-2">
                  {!event.read && <span className="size-1.5 rounded-full bg-foreground shrink-0" />}
                  <EventIcon type={event.type} size={13} />
                  <span className="text-[13px] font-medium text-foreground leading-none truncate flex-1">{event.title}</span>
                  <span className="text-[11px] text-muted-foreground shrink-0">{formatRelative(event.timestamp)}</span>
                </div>
                {event.preview && (
                  <p className="text-[12px] text-muted-foreground leading-4 pl-5 truncate">{event.preview}</p>
                )}
              </button>
            ))}
            {search && filtered.length === 0 && (
              <p className="text-[13px] text-muted-foreground px-3 py-3">No results</p>
            )}
          </div>
        </div>

        {/* Tasks widget */}
        <div className="flex-1 min-w-0 flex flex-col rounded-xl border border-border bg-background overflow-hidden">
          <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-border">
            <p className="text-[11px] font-semibold text-muted-foreground">Due today</p>
            <span className="flex items-center justify-center size-4 rounded-full bg-foreground/10 text-[9px] font-bold text-foreground leading-none">
              {MOCK_TODAY_TASKS.length}
            </span>
          </div>
          <div className="flex flex-col flex-1">
            {MOCK_TODAY_TASKS.map((task, i) => (
              <button
                key={task.id}
                type="button"
                onClick={() => {
                  if (task.title.toLowerCase().includes('medication review')) { onMedicationReview?.(); onClose(); }
                }}
                className={cn(
                  'flex items-start gap-2.5 w-full text-left px-3 py-2.5 hover:bg-accent transition-colors',
                  i < MOCK_TODAY_TASKS.length - 1 && 'border-b border-border',
                )}
              >
                <span className={cn(
                  'mt-[3px] shrink-0 size-2 rounded-full',
                  task.priority === 'High' ? 'bg-destructive' : task.priority === 'Medium' ? 'bg-warning' : 'bg-muted-foreground/40',
                )} />
                <span className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-[13px] font-medium text-foreground truncate">{task.title}</span>
                  <span className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                    {task.dueTime && <span className="font-medium text-foreground/70">{task.dueTime}</span>}
                    {task.dueTime && <span>·</span>}
                    {task.matter}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Apps widget */}
        <div className="shrink-0 flex flex-col rounded-xl border border-border bg-background overflow-hidden">
          <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-border">
            <p className="text-[11px] font-semibold text-muted-foreground">Apps</p>
            <button type="button" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Show all apps</button>
          </div>
          <div className="flex flex-col flex-1 p-2">
            <div className="grid grid-cols-3 gap-1.5">
              {APP_TILES.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="flex flex-col items-center justify-center gap-1.5 w-[80px] py-3 px-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-xs font-medium"
                >
                  <Icon size={20} weight="duotone" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function NavAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger
        aria-label={label}
        onClick={onClick}
        className="flex items-center justify-center size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side="bottom" sideOffset={4} style={{ zIndex: 200 }}>
          <TooltipPrimitive.Popup className="inline-flex items-center rounded-md bg-foreground px-3 py-1.5 text-xs text-background animate-in fade-in-0 zoom-in-95">
            {label}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}


// ── Root component (NavNotch) ─────────────────────────────────────────────────

export function NavNotch({ onSessionHistory, onWork, onSettings, onMedicationReview, onFileReview }: NavIslandProps) {
  const [notchState, setNotchState] = useState<NotchState>('idle');
  const [isClosing, setIsClosing] = useState(false);
  const [events, setEvents] = useState<IslandEvent[]>(MOCK_EVENTS);
  const [activeEvent, setActiveEvent] = useState<IslandEvent | null>(null);
  const [mounted, setMounted] = useState(false);
  const [notifyAnimKey, setNotifyAnimKey] = useState(0);
  const [hasNotification, setHasNotification] = useState(false);
  const [appointmentAnimKey, setAppointmentAnimKey] = useState(0);
  const [hasAppointment, setHasAppointment] = useState(false);
  // 'idle' | 'shake' | 'check' | 'done'
  const [reportPhase, setReportPhase] = useState<'idle' | 'shake' | 'check' | 'done'>('idle');
  const [reportAnimKey, setReportAnimKey] = useState(0);
  const eventTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Listen for appointment reminder events
  useEffect(() => {
    const handler = () => {
      if (notchState === 'expanded') return;
      setHasAppointment(true);
      setAppointmentAnimKey((k) => k + 1);
    };
    window.addEventListener('ix:appointment-reminder', handler);
    return () => window.removeEventListener('ix:appointment-reminder', handler);
  }, [notchState]);

  // Listen for report-complete events
  useEffect(() => {
    const handler = () => {
      if (notchState === 'expanded') return;
      setReportPhase('shake');
      setReportAnimKey((k) => k + 1);
      // After shake (900ms) → show check
      setTimeout(() => setReportPhase('check'), 900);
      // After check (900ms) → back to report icon with badge
      setTimeout(() => setReportPhase('done'), 1800);
    };
    window.addEventListener('ix:report-complete', handler);
    return () => window.removeEventListener('ix:report-complete', handler);
  }, [notchState]);

  // Listen for new notification events
  useEffect(() => {
    const handler = () => {
      if (notchState === 'expanded') return;
      setHasNotification(true);
      setNotifyAnimKey((k) => k + 1);
      const newEvent: IslandEvent = {
        id: String(Date.now()),
        type: 'notification',
        title: 'New notification',
        preview: 'You have a new notification requiring attention.',
        timestamp: new Date(),
        read: false,
      };
      setEvents((prev) => [newEvent, ...prev]);
    };
    window.addEventListener('ix:new-notification', handler);
    return () => window.removeEventListener('ix:new-notification', handler);
  }, [notchState]);

  const unreadCount = events.filter((e) => !e.read).length;
  const isExpanded = notchState === 'expanded';

  const closeIsland = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setNotchState('idle');
      setIsClosing(false);
    }, 240); // matches notch-collapse duration
  }, []);

  // Show an event notification temporarily
  const showEvent = useCallback((event: IslandEvent) => {
    if (notchState === 'expanded') return;
    setActiveEvent(event);
    setNotchState('event');
    if (eventTimerRef.current) clearTimeout(eventTimerRef.current);
    eventTimerRef.current = setTimeout(() => {
      setNotchState('idle');
      setActiveEvent(null);
    }, 4000);
  }, [notchState]);


  // Keyboard: Escape closes
  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeIsland(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isExpanded, closeIsland]);

  // Click outside to close
  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) closeIsland();
    };
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 10);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handler); };
  }, [isExpanded, closeIsland]);

  const handlePillClick = () => {
    if (eventTimerRef.current) clearTimeout(eventTimerRef.current);
    if (isExpanded) { closeIsland(); return; }
    setNotchState('expanded');
    setActiveEvent(null);
  };

  const handleMarkRead = (id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, read: true } : e)));
  };

  if (!mounted) return null;

  const showPanel = isExpanded || isClosing;

  const scrim = showPanel
    ? createPortal(
        <div
          aria-hidden="true"
          className={isClosing ? 'notch-scrim-out' : 'notch-scrim-in'}
          style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.45)' }}
        />,
        document.body,
      )
    : null;

  const island = createPortal(
    <div
      ref={containerRef}
      style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 99 }}
    >
      <TooltipProvider delay={300}>
      {/* Collapsed notch — hidden while panel is open/closing */}
      {!showPanel && (
        <button
          type="button"
          aria-label={unreadCount > 0 ? `Open navigation (${unreadCount} unread)` : 'Open navigation'}
          onClick={() => { setHasNotification(false); setHasAppointment(false); setReportPhase('idle'); handlePillClick(); }}
          className="relative flex items-center justify-center gap-2 bg-secondary text-sidebar-foreground border border-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent active:opacity-80 overflow-hidden transition-all duration-300"
          style={{ width: hasNotification && hasAppointment ? 112 : 80, height: 32, borderRadius: '0 0 4px 4px', borderTop: 'none' }}
        >
          {reportPhase !== 'idle' ? (
            <span key={reportAnimKey} className="relative inline-flex items-center justify-center shrink-0">
              {reportPhase === 'shake' && (
                <span className="notch-notify-shake inline-flex text-foreground">
                  <FileText size={20} weight="regular" />
                </span>
              )}
              {reportPhase === 'check' && (
                <span className="notch-icon-fade-in inline-flex" style={{ color: 'var(--success)' }}>
                  <CheckCircle size={20} weight="regular" />
                </span>
              )}
              {reportPhase === 'done' && (
                <>
                  <span className="notch-icon-fade-in inline-flex text-foreground">
                    <FileText size={20} weight="regular" />
                  </span>
                  <span className="notch-badge-pop absolute -bottom-1 -right-1.5 flex items-center justify-center size-3 rounded-full text-[7px] font-bold text-white leading-none" style={{ background: 'var(--success)' }}>
                    ✓
                  </span>
                </>
              )}
            </span>
          ) : (hasNotification || hasAppointment) ? (
            <span className="flex items-center gap-2">
              {hasNotification && (
                <span className="relative inline-flex items-center justify-center shrink-0">
                  <span key={notifyAnimKey} className="notch-notify-shake inline-flex">
                    <BellRinging size={20} weight="regular" />
                  </span>
                  <span className="notch-badge-pop absolute -bottom-1 -right-1.5 flex items-center justify-center size-3 rounded-full bg-destructive text-[7px] font-bold text-white leading-none">
                    1
                  </span>
                </span>
              )}
              {hasAppointment && (
                <span className="relative inline-flex items-center justify-center shrink-0">
                  <span key={appointmentAnimKey} className="notch-notify-shake inline-flex">
                    <CalendarBlank size={20} weight="regular" />
                  </span>
                </span>
              )}
            </span>
          ) : notchState === 'event' && activeEvent ? (
            <EventIcon type={activeEvent.type} size={20} />
          ) : (
            <span className="block rounded-full" style={{ width: 24, height: 4, border: '1.5px solid currentColor' }} />
          )}
        </button>
      )}

      {/* Expanded panel — animates open and closed */}
      {showPanel && (
        <div
          className={isClosing ? 'notch-collapse' : 'notch-expand'}
          style={{
            width: 'min(1360px, calc(100vw - 32px))',
            borderRadius: '0 0 8px 8px',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            borderTop: 'none',
            background: 'var(--nav-rail-bg)',
            boxShadow: '0 8px 32px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.08)',
          }}
        >
          <div className={isClosing ? 'notch-content-out' : 'notch-content-in'}>
            <ExpandedPanel
              events={events}
              onClose={closeIsland}
              onSessionHistory={onSessionHistory}
              onWork={onWork}
              onSettings={onSettings}
              onMarkRead={handleMarkRead}
              onMedicationReview={onMedicationReview}
              onFileReview={onFileReview}
            />
          </div>
        </div>
      )}
      </TooltipProvider>
    </div>,
    document.body,
  );

  return <>{scrim}{island}</>;
}
