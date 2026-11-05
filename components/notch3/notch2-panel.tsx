'use client';

import { useEffect, useRef } from 'react';
import { Bell, Microphone, MagnifyingGlass, Plus, Timer } from '@phosphor-icons/react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { cn } from '@/lib/utils';
import { CSS } from '@/lib/motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Notch2Item, Notch2ItemIcon, Notch2ItemList, Notch2TileHeader } from '@/components/ui/notch2-item';
import { Appointment } from '@/components/ui/iqons/Appointment';
import { Notifications } from '@/components/ui/iqons/Notifications';
import { Checklist } from '@/components/ui/iqons/Checklist';
import { Mail } from '@/components/ui/iqons/Mail';
import { Settings } from '@/components/ui/iqons/Settings';
import { ASSIGNEE_NAMES } from '@/components/work/task-data';
import { N3Tooltip } from './notch3-nav';
import { tasksDueToday, EmptyState } from './notch3-views';

export const NOTCH2_PANEL_MAX_W = 1248;
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
const MAX_VISIBLE_EMAILS = 5;

const MOCK_EMAILS = [
  { id: 'e1', initials: 'SW', sender: 'Sarah Whitmore', subject: 'Re: Completion date for Oakwood Avenue', time: '5 min' },
  { id: 'e2', initials: 'DP', sender: 'Dr Helen Murray', subject: 'Urgent: results for Margaret Ellison', time: '22 min' },
  { id: 'e3', initials: 'AP', sender: 'Arthur Pendleton', subject: 'Draft settlement letter for review', time: '1 hr' },
  { id: 'e4', initials: 'FM', sender: 'Finance Team', subject: 'October invoices awaiting approval', time: '2 hr' },
  { id: 'e5', initials: 'JC', sender: 'James Carter', subject: 'Updated contract terms for Brookfield Road', time: '3 hr' },
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
          <Separator orientation="vertical" className="mx-1 h-8 self-center" />
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
        icon={Notifications}
        title="Notifications"
        meta={hasNotification ? '1 unread' : 'Up to date'}
        cta={hasNotification ? 'Go to Notifications' : undefined}
        onCta={onClose}
      >
        {hasNotification ? (
          <Notch2Item
            isNew
            icon={<Notch2ItemIcon><Notifications size={24} /></Notch2ItemIcon>}
            title="New notification title"
            time="Just now"
          />
        ) : (
          <EmptyState icon={Bell} title="No new notifications" subtitle="You're up-to-date" cta="View all notifications" onClick={onClose} />
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
        icon={Checklist}
        title="Today's Tasks"
        meta={dueToday.length > 0 ? `${dueToday.length} to do` : 'All done'}
        cta="Go to Work"
        onCta={onNavigateWork}
      >
        {visibleTasks.length > 0 ? (
          <Notch2ItemList>
            {visibleTasks.map(task => (
              <Notch2Item
                key={task.id}
                icon={<Notch2ItemIcon />}
                title={`${task.ref} - ${task.title}`}
                body={task.assignee ? (ASSIGNEE_NAMES[task.assignee] ?? task.assignee) : task.type}
                badge="Due"
                priority={task.priority}
                time="Today"
                onClick={onNavigateWork}
              />
            ))}
          </Notch2ItemList>
        ) : (
          <EmptyNote>You&apos;re all caught up</EmptyNote>
        )}
      </OverviewCard>

      <OverviewCard
        icon={Mail}
        title="Inbox"
        meta={UNREAD_EMAIL_COUNT >= 9 ? '9+ unread' : `${UNREAD_EMAIL_COUNT} unread`}
        cta="Go to Inbox"
        onCta={onClose}
      >
        <Notch2ItemList>
          {MOCK_EMAILS.slice(0, MAX_VISIBLE_EMAILS).map((email, i) => (
            <Notch2Item
              key={email.id}
              isNew={i === 0}
              initials={email.initials}
              avatarIndex={i}
              title={email.sender}
              subtitle={email.subject}
              time={email.time}
              onClick={onClose}
            />
          ))}
        </Notch2ItemList>
      </OverviewCard>

      <OverviewCard
        icon={Appointment}
        title="Next appointments"
        meta="Today"
        cta="Go to Calendar"
        onCta={onClose}
      >
        <Notch2ItemList>
          <AppointmentRow name="SMITH, Ronald (Mr)" when="in 15 minutes" highlight={hasCalendarEvent} />
          <AppointmentRow name="GOODRIDGE, Helen (Mrs)" when="in 30 minutes" />
        </Notch2ItemList>
      </OverviewCard>
    </div>
  );
}

function OverviewCard({ icon: Icon, title, meta, cta, onCta, children }: {
  icon: React.ElementType;
  title: string;
  meta: string;
  cta?: string;
  onCta: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      className="flex min-w-0 flex-1 flex-col gap-4 rounded-lg border border-border p-4"
      style={{ backgroundImage: 'var(--tile-bg)' }}
    >
      <Notch2TileHeader icon={Icon} title={title} meta={meta} />
      <div className="flex flex-1 flex-col gap-2 pt-2">{children}</div>
      {cta && (
        <Button variant="outline" size="sm" className="h-10 w-full shrink-0 bg-background dark:bg-background text-xs" onClick={onCta}>
          {cta}
        </Button>
      )}
    </section>
  );
}

function AppointmentRow({ name, when, highlight = false }: { name: string; when: string; highlight?: boolean }) {
  return (
    <Notch2Item
      isNew={highlight}
      icon={<Notch2ItemIcon><Appointment size={24} className={cn(highlight && 'animate-pulse text-chart-1')} /></Notch2ItemIcon>}
      title={name}
      subtitle="Appointment"
      time={when}
    />
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="select-none py-6 text-center text-sm text-muted-foreground">{children}</p>;
}
