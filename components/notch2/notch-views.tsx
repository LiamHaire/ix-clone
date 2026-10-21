'use client';

import { Bell, ClockCounterClockwise, CalendarBlank, ChartBar, Heartbeat, Monitor, Microphone, Books, FileText, Envelope, Phone, Users, ClipboardText, Money, Clock, FolderOpen, UserCircle, Buildings, IdentificationBadge, ShieldCheck } from '@phosphor-icons/react';
import { MOCK_EVENTS, formatRelative, type IslandEvent } from '@/components/nav-island/island-mock-events';
import { MOCK_SESSIONS, type Session } from '@/components/chat/session-history-list';
import { TASK_DATA, type Task } from '@/components/work/task-data';
import type { NavId } from './notch-nav';

// ── Placeholder ───────────────────────────────────────────────────────────────

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-1 text-muted-foreground select-none">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs">Content goes here</p>
    </div>
  );
}

// ── Shared "View all" footer ──────────────────────────────────────────────────

function ViewAllButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="px-4 pt-4 pb-4 mt-auto">
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-center h-8 rounded-lg border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        View all
      </button>
    </div>
  );
}

// ── Recent sessions view ──────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatSessionDate(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const today     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const day       = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  if (day.getTime() === today.getTime())     return `Today ${hh}:${mm}`;
  if (day.getTime() === yesterday.getTime()) return `Yesterday ${hh}:${mm}`;
  return `${String(d.getDate()).padStart(2,'0')} ${MONTHS[d.getMonth()]}`;
}

function RecentSessionsView({ onViewAll }: { onViewAll: () => void }) {
  const sessions = MOCK_SESSIONS.slice(0, 5);
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground select-none">
        <ClockCounterClockwise size={22} weight="duotone" className="opacity-40" />
        <p className="text-sm">No recent sessions</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col" style={{ minHeight: 240 - 44 }}>
      <div className="flex-1 flex flex-col px-2 pt-2">
        {sessions.map((s) => <SessionRow key={s.id} session={s} />)}
      </div>
      <ViewAllButton onClick={onViewAll} />
    </div>
  );
}

function SessionRow({ session }: { session: Session }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors cursor-default group">
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{session.title}</p>
        <p className="text-xs text-muted-foreground truncate">
          {session.subtitle}
          <span className="mx-1.5">·</span>
          {session.itemCount} {session.itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>
      <p className="text-[11px] text-muted-foreground shrink-0">{formatSessionDate(session.isoDate)}</p>
    </div>
  );
}

// ── Notifications view ────────────────────────────────────────────────────────

const NOTIFICATIONS = MOCK_EVENTS.filter((e) => e.type === 'notification' || e.type === 'alert');

function NotificationsView({ onViewAll }: { onViewAll: () => void }) {
  if (NOTIFICATIONS.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground select-none">
        <Bell size={22} weight="duotone" className="opacity-40" />
        <p className="text-sm">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 240 - 44 }}>
      <div className="flex-1 flex flex-col px-2 pt-2">
        {NOTIFICATIONS.map((n) => (
          <NotificationRow key={n.id} item={n} />
        ))}
      </div>
      <ViewAllButton onClick={onViewAll} />
    </div>
  );
}

function NotificationRow({ item }: { item: IslandEvent }) {
  return (
    <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors cursor-default group">
      <div className="relative mt-0.5 shrink-0">
        <Bell size={16} weight="duotone" className="text-muted-foreground" />
        {!item.read && (
          <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-destructive" />
        )}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
          <p className="text-[11px] text-muted-foreground shrink-0">{formatRelative(item.timestamp)}</p>
        </div>
        {item.preview && (
          <p className="text-xs text-muted-foreground truncate">{item.preview}</p>
        )}
      </div>
    </div>
  );
}

// ── Apps view ─────────────────────────────────────────────────────────────────

const APP_TILES = [
  { label: 'Calendar',    icon: CalendarBlank  },
  { label: 'Reporting',   icon: ChartBar       },
  { label: 'IQ Health',   icon: Heartbeat      },
  { label: 'Admin',       icon: Monitor        },
  { label: 'Scribe',      icon: Microphone     },
  { label: 'Knowledge',   icon: Books          },
  { label: 'Documents',   icon: FileText       },
  { label: 'Messages',    icon: Envelope       },
  { label: 'Calls',       icon: Phone          },
  { label: 'Contacts',    icon: Users          },
  { label: 'Tasks',       icon: ClipboardText  },
  { label: 'Billing',     icon: Money          },
  { label: 'Time',        icon: Clock          },
  { label: 'Files',       icon: FolderOpen     },
  { label: 'Compliance',  icon: ClipboardText  },
  { label: 'Workflows',   icon: ChartBar       },
] as const;

function AppsView() {
  return (
    <div className="px-4 pt-3 pb-4">
      <div className="grid grid-cols-4 gap-2">
        {APP_TILES.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-xs font-medium"
          >
            <Icon size={20} weight="duotone" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Tasks view ────────────────────────────────────────────────────────────────

const PRIORITY_DOT: Record<Task['priority'], string> = {
  high:   'bg-destructive',
  medium: 'bg-warning',
  low:    'bg-muted-foreground/40',
};

function TasksView({ onViewAll }: { onViewAll: () => void }) {
  const lanes = TASK_DATA.filter((l) => l.id === 'due' || l.id === 'inprogress');
  return (
    <div className="flex flex-col" style={{ minHeight: 240 - 44 }}>
    <div className="grid grid-cols-2 gap-2 px-4 pt-3">
      {lanes.map((lane) => (
        <div key={lane.id} className="flex flex-col gap-1 rounded-xl border border-border bg-background overflow-hidden">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-[11px] font-semibold text-muted-foreground">{lane.label}</p>
          </div>
          <div className="flex flex-col p-1">
            {lane.tasks.length === 0 ? (
              <p className="px-3 py-3 text-xs text-muted-foreground">No tasks</p>
            ) : (
              lane.tasks.map((task) => <TaskRow key={task.id} task={task} />)
            )}
          </div>
        </div>
      ))}
    </div>
    <ViewAllButton onClick={onViewAll} />
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors cursor-default">
      <span className={`mt-px shrink-0 size-2 rounded-full ${PRIORITY_DOT[task.priority]}`} />
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
        <p className="text-[11px] text-muted-foreground">{task.ref}</p>
      </div>
      {task.assignee && (
        <span className="shrink-0 flex items-center justify-center size-6 rounded-full bg-muted text-[10px] font-semibold text-muted-foreground border border-border">
          {task.assignee}
        </span>
      )}
    </div>
  );
}

// ── Profile view ─────────────────────────────────────────────────────────────

function ProfileView() {
  return (
    <div className="px-4 pt-4 pb-4">
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        {/* Card header strip */}
        <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 60%, transparent) 100%)' }} />

        <div className="flex gap-4 p-4">
          {/* Avatar column */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="flex items-center justify-center size-16 rounded-xl bg-muted border border-border">
              <UserCircle size={40} weight="duotone" className="text-muted-foreground" />
            </div>
            <span className="flex items-center justify-center size-6 rounded-full bg-muted border border-border text-[10px] font-bold text-foreground">LH</span>
          </div>

          {/* Details column */}
          <div className="flex flex-col gap-2.5 flex-1 min-w-0">
            <div>
              <p className="text-[15px] font-semibold text-foreground leading-tight">Liam Haire</p>
              <p className="text-[12px] text-muted-foreground">Senior Product Designer</p>
            </div>

            <div className="h-px bg-border" />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Buildings size={13} weight="duotone" className="text-muted-foreground shrink-0" />
                <span className="text-[12px] text-foreground truncate">One Advanced</span>
              </div>
              <div className="flex items-center gap-2">
                <IdentificationBadge size={13} weight="duotone" className="text-muted-foreground shrink-0" />
                <span className="text-[12px] text-foreground truncate">IQ Platform · Product</span>
              </div>
              <div className="flex items-center gap-2">
                <Envelope size={13} weight="duotone" className="text-muted-foreground shrink-0" />
                <span className="text-[12px] text-muted-foreground truncate">l.haire@oneadvanced.com</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={13} weight="duotone" className="text-muted-foreground shrink-0" />
                <span className="text-[12px] text-muted-foreground">Admin · All modules</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30">
          <span className="text-[11px] text-muted-foreground">ID: IQ-LH-00142</span>
          <button type="button" className="text-[12px] font-medium text-muted-foreground hover:text-destructive transition-colors">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Heights ───────────────────────────────────────────────────────────────────

export const VIEW_HEIGHTS: Record<NavId | 'default', number> = {
  default:       176,
  recent:        260,
  tasks:         300,
  notifications: 240,
  apps:          336,
  record:        176,
  settings:      300,
};

// ── Router ────────────────────────────────────────────────────────────────────

interface NotchViewProps {
  id: NavId | null;
  onViewAllSessions: () => void;
  onViewAllTasks: () => void;
  onViewAllNotifications: () => void;
}

export function NotchView({ id, onViewAllSessions, onViewAllTasks, onViewAllNotifications }: NotchViewProps) {
  switch (id) {
    case 'recent':        return <RecentSessionsView onViewAll={onViewAllSessions} />;
    case 'tasks':         return <TasksView onViewAll={onViewAllTasks} />;
    case 'notifications': return <NotificationsView onViewAll={onViewAllNotifications} />;
    case 'apps':          return <AppsView />;
    case 'settings':      return <Placeholder title="Settings" />;
    default:              return null;
  }
}
