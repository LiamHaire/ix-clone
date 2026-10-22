'use client';

import { Bell, CheckCircle, CalendarBlank, ListChecks } from '@phosphor-icons/react';
import type { NavId3 } from './notch3-nav';
import { TASK_DATA, ASSIGNEE_NAMES, type Task } from '@/components/work/task-data';

// ── Per-view heights (content area, excluding header/divider) ─────────────────
export const VIEW_HEIGHTS_3: Record<NavId3, number> = {
  notifications: 148,
  tasks:         148,
  calendar:      148,
  record:        320,
  knowledge:     320,
};

const TASKS_LIST_MAX_H = 148;

function tasksDueToday(): Task[] {
  const today = new Date().toISOString().slice(0, 10);
  return TASK_DATA.flatMap(lane => lane.tasks).filter(t => t.dueDate === today);
}

// ── Shared alert card ─────────────────────────────────────────────────────────

interface AlertCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  time: string;
}

function AlertCard({ icon: Icon, title, subtitle, time }: AlertCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background/60 px-3 py-3">
      <div className="flex items-center justify-center size-9 rounded-lg shrink-0 bg-accent">
        <Icon size={18} weight="duotone" className="text-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground truncate">{title}</p>
        <p className="text-[12px] text-muted-foreground truncate mt-0.5">{subtitle}</p>
      </div>
      <span className="text-[11px] text-muted-foreground shrink-0">{time}</span>
    </div>
  );
}

// ── Empty states ──────────────────────────────────────────────────────────────

function NotificationsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full select-none">
      <Bell size={48} weight="regular" className="text-foreground mb-3" />
      <p className="text-[14px] font-medium text-foreground">No new notifications</p>
      <p className="text-[14px] text-muted-foreground mt-0.5">You're up-to-date</p>
    </div>
  );
}

function TasksEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full select-none">
      <CheckCircle size={48} weight="regular" className="text-foreground mb-3" />
      <p className="text-[14px] font-medium text-foreground">You're all caught up</p>
      <p className="text-[14px] text-muted-foreground mt-0.5">All today's tasks have been completed</p>
    </div>
  );
}

function CalendarEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full select-none">
      <CalendarBlank size={48} weight="regular" className="text-foreground mb-3" />
      <p className="text-[14px] font-medium text-foreground">No upcoming events</p>
      <p className="text-[14px] text-muted-foreground mt-0.5">Enjoy the peace and quiet</p>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-1 text-muted-foreground select-none">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs">Content goes here</p>
    </div>
  );
}

// ── View router ───────────────────────────────────────────────────────────────

interface Notch3ViewProps {
  id: NavId3 | null;
  hasNotification?: boolean;
  hasTaskAlert?: boolean;
  hasCalendarEvent?: boolean;
}

export function Notch3View({ id, hasNotification, hasTaskAlert, hasCalendarEvent }: Notch3ViewProps) {
  switch (id) {
    case 'notifications':
      return hasNotification ? (
        <AlertCard
          icon={Bell}
          title="File review due"
          subtitle="Whitmore matter · 3 days overdue"
          time="2m ago"
        />
      ) : <NotificationsEmpty />;

    case 'tasks': {
      const dueToday = tasksDueToday();
      if (hasTaskAlert) {
        return (
          <AlertCard
            icon={ListChecks}
            title="Send referral letter"
            subtitle="Assigned by Dr. Shaw · Due today"
            time="Just now"
          />
        );
      }
      if (dueToday.length === 0) return <TasksEmpty />;
      return (
        <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: TASKS_LIST_MAX_H }}>
          {dueToday.map(task => (
            <div key={task.id} className="flex items-center gap-3 rounded-lg border border-border bg-background/60 px-3 py-3">
              <div className="flex items-center justify-center size-9 rounded-lg shrink-0 bg-accent">
                <ListChecks size={18} weight="duotone" className="text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">{task.title}</p>
                <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                  {task.ref}{task.assignee ? ` · ${ASSIGNEE_NAMES[task.assignee] ?? task.assignee}` : ''}
                </p>
              </div>
              <span className="text-[11px] text-muted-foreground shrink-0 capitalize">{task.priority}</span>
            </div>
          ))}
        </div>
      );
    }

    case 'calendar':
      return hasCalendarEvent ? (
        <AlertCard
          icon={CalendarBlank}
          title="Team standup"
          subtitle="With Dr. Shaw & team · Remote"
          time="In 15 min"
        />
      ) : <CalendarEmpty />;

    case 'record':    return <Placeholder title="Scribe" />;
    case 'knowledge': return <Placeholder title="Knowledge base" />;
    default:          return <Placeholder title="Notch 3" />;
  }
}
