'use client';

import { Bell, CheckCircle, CalendarBlank, Envelope } from '@phosphor-icons/react';
import { Notch2Item, Notch2ItemIcon, Notch2ItemList, Notch2TileHeader } from '@/components/ui/notch2-item';
import { Notifications } from '@/components/ui/iqons/Notifications';
import { Appointment } from '@/components/ui/iqons/Appointment';
import { Checklist } from '@/components/ui/iqons/Checklist';
import { Mail } from '@/components/ui/iqons/Mail';
import { type NavId3 } from './notch3-nav';
import { TASK_DATA, ASSIGNEE_NAMES, type Task } from '@/components/work/task-data';
import { Button } from '@/components/ui/button';

// ── Height model ──────────────────────────────────────────────────────────────

export const ROW_H           = 58; // NotchItem row height (Figma)
export const ROW_GAP         =  1; // divider between rows
const OUTER_GAP              = 16;
const FOOTER_BTN_H           = 40;
const TILE_HEADER_H          = 20;
const FOOTER_TOTAL           = OUTER_GAP + FOOTER_BTN_H; // 56
const LIST_TOTAL             = TILE_HEADER_H + OUTER_GAP + FOOTER_TOTAL; // header + gap + footer
const MAX_VISIBLE_MAIL       =  5;
const MAX_VISIBLE_TASKS      =  3;
export const EMPTY_H         = 148;

// Back-compat aliases
export const TASK_ROW_H    = ROW_H;
export const TASK_ROW_GAP  = ROW_GAP;
export const TASKS_EMPTY_H = EMPTY_H;

export const VIEW_HEIGHTS_3: Record<NavId3, number> = {
  notifications: EMPTY_H,
  chat:          EMPTY_H,
  tasks:         EMPTY_H,
  calendar:      EMPTY_H,
};

// ── Height helpers ────────────────────────────────────────────────────────────

export function tasksDueToday(): Task[] {
  const today = new Date().toISOString().slice(0, 10);
  return TASK_DATA.flatMap(lane => lane.tasks).filter(t => t.dueDate === today);
}

export function tasksContentHeight(): number {
  const count = tasksDueToday().length;
  if (count === 0) return EMPTY_H;
  const visible = Math.min(count, MAX_VISIBLE_TASKS);
  return visible * ROW_H + (visible - 1) * ROW_GAP + LIST_TOTAL;
}

export function mailContentHeight(): number {
  const count = Math.min(RECENT_MAIL.length, MAX_VISIBLE_MAIL);
  if (count === 0) return EMPTY_H;
  return count * ROW_H + (count - 1) * ROW_GAP + LIST_TOTAL;
}

function NavButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Button variant="outline" size="sm" className="h-10 text-[13px] w-full bg-background dark:bg-card" onClick={onClick}>
      {label}
    </Button>
  );
}

export function EmptyState({ icon: Icon, title, subtitle, cta, onClick }: {
  icon: React.ElementType; title: string; subtitle: string; cta: string; onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full select-none">
      <Icon size={48} weight="regular" className="text-foreground mb-3" />
      <p className="text-[14px] font-medium text-foreground">{title}</p>
      <p className="text-[14px] text-muted-foreground mt-0.5">{subtitle}</p>
      <div className="w-full mt-3"><NavButton label={cta} onClick={onClick} /></div>
    </div>
  );
}

// ── Mail data ─────────────────────────────────────────────────────────────────

interface MailItem { id: string; sender: string; subject: string; time: string; unread?: boolean; }

export const RECENT_MAIL: MailItem[] = [
  { id: 'm1', sender: 'Sarah Whitmore', subject: 'Re: Completion date for Oakwood Avenue', time: '5 min' },
  { id: 'm2', sender: 'Dr Helen Murray', subject: 'Urgent: results for Margaret Ellison', time: '22 min' },
  { id: 'm3', sender: 'Arthur Pendleton', subject: 'Draft settlement letter for review', time: '1 hr' },
  { id: 'm4', sender: 'Finance Team', subject: 'October invoices awaiting approval', time: '2 hr' },
  { id: 'm5', sender: 'James Carter', subject: 'Updated contract terms for Brookfield Road', time: '3 hr' },
];

// ── Placeholder ───────────────────────────────────────────────────────────────

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-1 text-muted-foreground select-none">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs">Content goes here</p>
    </div>
  );
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export type QuickActionId = 'record' | 'knowledge';

// ── View router ───────────────────────────────────────────────────────────────

interface Notch3ViewProps {
  id: NavId3 | null;
  hasNotification?: boolean;
  hasNewChat?: boolean;
  hasCalendarEvent?: boolean;
  onNavigateWork?: () => void;
}

export function Notch3View({ id, hasNotification, hasNewChat, hasCalendarEvent, onNavigateWork }: Notch3ViewProps) {
  switch (id) {

    case 'notifications':
      return hasNotification ? (
        <div className="flex flex-col gap-4">
          <Notch2TileHeader icon={Notifications} title="Notifications" meta="1 unread" />
          <Notch2Item
            isNew
            icon={<Notch2ItemIcon><Notifications size={24} /></Notch2ItemIcon>}
            title="File review due"
            subtitle="Whitmore matter · 3 days overdue"
          />
          <NavButton label="View all notifications" />
        </div>
      ) : (
        <EmptyState icon={Bell} title="No new notifications" subtitle="You're up-to-date" cta="View all notifications" />
      );

    case 'chat': {
      if (RECENT_MAIL.length === 0) {
        return <EmptyState icon={Envelope} title="No recent mail" subtitle="Nothing in the last 24 hours" cta="Go to Inbox" />;
      }
      const displayMail = RECENT_MAIL.slice(0, MAX_VISIBLE_MAIL).map((mail, i) =>
        i === 0 && hasNewChat ? { ...mail, unread: true, time: 'just now' } : mail
      );
      return (
        <div className="flex flex-col gap-4">
          <Notch2TileHeader icon={Mail} title="Inbox" meta="9+ unread" />
          <Notch2ItemList>
            {displayMail.map((mail, i) => (
              <Notch2Item
                key={mail.id}
                isNew={Boolean(mail.unread)}
                initials={getInitials(mail.sender)}
                avatarIndex={i}
                title={mail.sender}
                subtitle={mail.subject}
                time={mail.time}
              />
            ))}
          </Notch2ItemList>
          <NavButton label="Go to Inbox" />
        </div>
      );
    }

    case 'tasks': {
      const dueToday = tasksDueToday();
      if (dueToday.length === 0) {
        return <EmptyState icon={CheckCircle} title="You're all caught up" subtitle="All today's tasks have been completed" cta="View all tasks" onClick={onNavigateWork} />;
      }
      return (
        <div className="flex flex-col gap-4">
          <Notch2TileHeader icon={Checklist} title="Today's Tasks" meta={`${dueToday.length} to do`} />
          <div className="overflow-y-auto" style={{ maxHeight: MAX_VISIBLE_TASKS * ROW_H + (MAX_VISIBLE_TASKS - 1) * ROW_GAP }}>
            <Notch2ItemList>
              {dueToday.map(task => (
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
          </div>
          <NavButton label="View all tasks" onClick={onNavigateWork} />
        </div>
      );
    }

    case 'calendar':
      return hasCalendarEvent ? (
        <div className="flex flex-col gap-4">
          <Notch2TileHeader icon={Appointment} title="Next appointments" meta="Today" />
          <Notch2Item
            isNew
            icon={<Notch2ItemIcon><Appointment size={24} /></Notch2ItemIcon>}
            title="Team standup"
            subtitle="With Dr. Shaw & team · Remote"
            time="in 15 mins"
          />
          <NavButton label="Open calendar" />
        </div>
      ) : (
        <EmptyState icon={CalendarBlank} title="No upcoming events" subtitle="Enjoy the peace and quiet" cta="Open calendar" />
      );

    default:          return <Placeholder title="Notch 3" />;
  }
}
