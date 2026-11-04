'use client';

import { useEffect, useRef } from 'react';
import { Bell, CalendarBlank, Envelope, ListChecks, Microphone, MagnifyingGlass, Plus, Timer } from '@phosphor-icons/react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { cn } from '@/lib/utils';
import { CSS } from '@/lib/motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NotchItem } from '@/components/ui/notch-item';
import { Appointment } from '@/components/ui/iqons/Appointment';
import { Notifications } from '@/components/ui/iqons/Notifications';
import { Settings } from '@/components/ui/iqons/Settings';
import { ASSIGNEE_NAMES } from '@/components/work/task-data';
import { N3Tooltip } from './notch3-nav';
import { tasksDueToday } from './notch3-views';

export const NOTCH2_PANEL_MAX_W = 1128;
export const NOTCH2_NOTIFICATIONS_W = 640;
export const NOTCH2_PANEL_PADDING = 16;
export const NOTCH2_HEADER_H = 32;
export const NOTCH2_HEADER_GAP = 8;
export const NOTCH2_CONTENT_GAP = 16;
export const NOTCH2_CONTENT_H = 250;
export const NOTCH2_PANEL_RADIUS = '0 0 16px 16px';
export const NOTCH2_PANEL_H =
  NOTCH2_PANEL_PADDING * 2 + NOTCH2_HEADER_H + NOTCH2_HEADER_GAP + 1 + NOTCH2_CONTENT_GAP + NOTCH2_CONTENT_H;

const MAX_VISIBLE_TASKS = 2;
const MAX_VISIBLE_EMAILS = 3;

const MOCK_EMAILS = [
  { id: 'e1', initials: 'SW', sender: 'Sarah Whitmore', subject: 'Re: Completion date for Oakwood Avenue', time: '5 min' },
  { id: 'e2', initials: 'DP', sender: 'Dr Helen Murray', subject: 'Urgent: results for Margaret Ellison', time: '22 min' },
  { id: 'e3', initials: 'AP', sender: 'Arthur Pendleton', subject: 'Draft settlement letter for review', time: '1 hr' },
  { id: 'e4', initials: 'FM', sender: 'Finance Team', subject: 'October invoices awaiting approval', time: '2 hr' },
];
const UNREAD_EMAIL_COUNT = 9;

// ── Header ────────────────────────────────────────────────────────────────────

export type Notch2Tab = 'today' | 'notifications';

interface Notch2HeaderProps {
  activeTab: Notch2Tab | null;
  onSelectTab: (tab: Notch2Tab) => void;
  hasNotification?: boolean;
  onToggleScribe: () => void;
  onAddToKnowledge: () => void;
  onOpenSettings: () => void;
  isRecording?: boolean;
}

export function Notch2Header({ activeTab, onSelectTab, hasNotification = false, onToggleScribe, onAddToKnowledge, onOpenSettings, isRecording = false }: Notch2HeaderProps) {
  return (
    <div className="flex flex-col shrink-0" style={{ gap: NOTCH2_HEADER_GAP }}>
      <div role="toolbar" aria-label="Notch 2 actions" className="flex items-center justify-between" style={{ height: NOTCH2_HEADER_H }}>
        <div className="flex items-center gap-1">
          <HeaderBtn
            label="Today"
            active={activeTab === 'today'}
            onPress={() => onSelectTab('today')}
            icon={<Appointment size={20} variant={activeTab === 'today' ? 'duotone' : 'outline'} />}
          />
          <HeaderBtn
            label="Notifications"
            active={activeTab === 'notifications'}
            onPress={() => onSelectTab('notifications')}
            badge={hasNotification}
            icon={<Notifications size={20} variant={activeTab === 'notifications' ? 'duotone' : 'outline'} />}
          />
        </div>
        <div className="flex items-center gap-1">
          <HeaderBtn
            label={isRecording ? 'Stop Scribe' : 'Start Scribe'}
            onPress={onToggleScribe}
            recording={isRecording}
            icon={<Microphone size={20} weight={isRecording ? 'fill' : 'regular'} />}
          />
          <HeaderBtn label="Add to Knowledge base" onPress={onAddToKnowledge} icon={<Plus size={20} />} />
          <HeaderBtn label="Timer" icon={<Timer size={20} />} />
          <HeaderBtn label="Search" icon={<MagnifyingGlass size={20} />} />
          <Separator orientation="vertical" className="mx-1 h-5" />
          <HeaderBtn label="Settings" onPress={onOpenSettings} icon={<Settings size={20} />} />
          <HeaderBtn
            label="Liam Haire"
            round
            icon={<span className="text-[11px] font-semibold leading-none">LH</span>}
            className="border border-border text-foreground"
          />
        </div>
      </div>
      <Separator />
    </div>
  );
}

function HeaderBtn({ label, icon, onPress, recording = false, round = false, active = false, badge = false, className }: {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  recording?: boolean;
  round?: boolean;
  active?: boolean;
  badge?: boolean;
  className?: string;
}) {
  return (
    <N3Tooltip label={label}>
      <TooltipPrimitive.Trigger
        delay={600}
        closeDelay={200}
        aria-label={label}
        onClick={onPress}
        className={cn(
          'relative flex size-8 shrink-0 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          round ? 'rounded-full' : 'rounded-full text-muted-foreground hover:text-foreground hover:bg-accent',
          active && 'bg-accent text-foreground',
          recording && 'text-destructive! hover:text-destructive!',
          className,
        )}
        aria-pressed={active || undefined}
        style={{ transition: `background-color ${CSS.durFast} ${CSS.easeOutCubic}, color ${CSS.durFast} ${CSS.easeOutCubic}` }}
      >
        {icon}
        {recording && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-destructive animate-pulse" />}
        {badge && <span className="absolute top-1 right-1 size-2 rounded-full bg-chart-1" />}
      </TooltipPrimitive.Trigger>
    </N3Tooltip>
  );
}

// ── Overview cards ────────────────────────────────────────────────────────────

function useReportHeight(onHeightChange?: (height: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !onHeightChange) return;
    const report = () => onHeightChange(Math.ceil(el.getBoundingClientRect().height));
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onHeightChange]);
  return ref;
}

interface Notch2NotificationsProps {
  hasNotification: boolean;
  onClose: () => void;
  onHeightChange?: (height: number) => void;
}

export function Notch2Notifications({ hasNotification, onClose, onHeightChange }: Notch2NotificationsProps) {
  const rootRef = useReportHeight(onHeightChange);

  return (
    <div ref={rootRef} className="flex items-stretch">
      <OverviewCard
        icon={Bell}
        title="Notifications"
        meta={hasNotification ? '1 unread' : 'Up to date'}
        cta="Go to Notifications"
        onCta={onClose}
      >
        {hasNotification ? (
          <NotchItem type="notification" isNew bordered title="New notification title" description="Just now" />
        ) : (
          <EmptyNote>No new notifications</EmptyNote>
        )}
      </OverviewCard>
    </div>
  );
}

interface Notch2OverviewProps {
  hasCalendarEvent: boolean;
  onNavigateWork: () => void;
  onClose: () => void;
  onHeightChange?: (height: number) => void;
}

export function Notch2Overview({ hasCalendarEvent, onNavigateWork, onClose, onHeightChange }: Notch2OverviewProps) {
  const dueToday = tasksDueToday();
  const visibleTasks = dueToday.slice(0, MAX_VISIBLE_TASKS);
  const rootRef = useReportHeight(onHeightChange);

  return (
    <div ref={rootRef} className="flex items-stretch gap-2">
      <OverviewCard
        icon={ListChecks}
        title="Today's Tasks"
        meta={dueToday.length > 0 ? `${dueToday.length} to do` : 'All done'}
        cta="Go to Work"
        onCta={onNavigateWork}
      >
        {visibleTasks.length > 0 ? (
          visibleTasks.map(task => (
            <NotchItem
              key={task.id}
              type="task"
              bordered
              taskRef={task.ref}
              title={task.title}
              description={task.assignee ? (ASSIGNEE_NAMES[task.assignee] ?? task.assignee) : task.type}
              status="Due"
              priority={task.priority}
              onClick={onNavigateWork}
            />
          ))
        ) : (
          <EmptyNote>You&apos;re all caught up</EmptyNote>
        )}
      </OverviewCard>

      <OverviewCard
        icon={Envelope}
        title="Inbox"
        meta={UNREAD_EMAIL_COUNT >= 9 ? '9+ unread' : `${UNREAD_EMAIL_COUNT} unread`}
        cta="Go to Inbox"
        onCta={onClose}
      >
        {MOCK_EMAILS.slice(0, MAX_VISIBLE_EMAILS).map(email => (
          <NotchItem
            key={email.id}
            type="message"
            bordered
            initials={email.initials}
            title={email.sender}
            description={email.subject}
            time={email.time}
            onClick={onClose}
          />
        ))}
      </OverviewCard>

      <OverviewCard
        icon={CalendarBlank}
        title="Next appointments"
        meta="Today"
        cta="Go to Calendar"
        onCta={onClose}
      >
        <AppointmentRow name="SMITH, Ronald (Mr)" when="in 15 minutes" highlight={hasCalendarEvent} />
        <AppointmentRow name="GOODRIDGE, Helen (Mrs)" when="in 30 minutes" />
      </OverviewCard>
    </div>
  );
}

function OverviewCard({ icon: Icon, title, meta, cta, onCta, children }: {
  icon: React.ElementType;
  title: string;
  meta: string;
  cta: string;
  onCta: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      className="flex min-w-0 flex-1 flex-col gap-4 rounded-lg border border-border p-4"
      style={{
        backgroundImage:
          'linear-gradient(-1.74deg, oklch(from var(--accent) 0.6 0.15 h / var(--tile-glow-alpha)) 2.09%, transparent 70%), linear-gradient(color-mix(in srgb, var(--muted) 50%, transparent), color-mix(in srgb, var(--muted) 50%, transparent))',
      }}
    >
      <header className="flex h-5 items-center gap-2">
        <Icon size={16} weight="regular" className="shrink-0 text-foreground" />
        <h3 className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{title}</h3>
        <span className="shrink-0 text-xs text-muted-foreground">{meta}</span>
      </header>
      <div className="flex flex-1 flex-col gap-2 pt-2">{children}</div>
      <Button variant="outline" size="sm" className="h-10 w-full shrink-0 bg-background dark:bg-background text-xs" onClick={onCta}>
        {cta}
      </Button>
    </section>
  );
}

function AppointmentRow({ name, when, highlight = false }: { name: string; when: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className={cn('h-10 w-1 shrink-0 rounded-[2px] bg-chart-1', highlight && 'animate-pulse')} />
      <NotchItem
        type="event"
        title={name}
        description={when}
        className="flex-1 bg-transparent px-0 py-2"
      />
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="select-none py-6 text-center text-sm text-muted-foreground">{children}</p>;
}
