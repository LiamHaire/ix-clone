'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCircle, CalendarBlank, ListChecks, ChatCircle, ArrowLeft, PaperPlaneRight, Plus } from '@phosphor-icons/react';
import type { NavId3 } from './notch3-nav';
import { TASK_DATA, ASSIGNEE_NAMES, type Task } from '@/components/work/task-data';
import { Button } from '@/components/ui/button';

// ── Height model ──────────────────────────────────────────────────────────────

export const ROW_H           = 67;
export const ROW_GAP         =  8;
const SECTION_LABEL_H        = 20;
const OUTER_GAP              = 16;
const FOOTER_BTN_H           = 32;
const FOOTER_TOTAL           = OUTER_GAP + FOOTER_BTN_H; // 48
const CHAT_ROW_H             = 64;
const MAX_VISIBLE_TASKS      =  3;
export const EMPTY_H         = 148;
export const CHAT_DETAIL_H   = 400;

// Back-compat aliases
export const TASK_ROW_H    = ROW_H;
export const TASK_ROW_GAP  = ROW_GAP;
export const TASKS_EMPTY_H = EMPTY_H;
export const CHAT_EMPTY_H  = EMPTY_H;

export const VIEW_HEIGHTS_3: Record<NavId3, number> = {
  notifications: EMPTY_H,
  chat:          EMPTY_H,
  tasks:         EMPTY_H,
  calendar:      EMPTY_H,
  record:        320,
  knowledge:     320,
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
  return visible * ROW_H + (visible - 1) * ROW_GAP + FOOTER_TOTAL;
}

function sectionH(n: number) {
  return SECTION_LABEL_H + n * (CHAT_ROW_H + ROW_GAP);
}

export function chatContentHeight(hasNewChat: boolean, activeChatId?: string | null): number {
  if (activeChatId) return CHAT_DETAIL_H;
  const hasRecent = RECENT_CHATS.length > 0;
  if (!hasNewChat && !hasRecent) return EMPTY_H;
  let h = 0;
  let sections = 0;
  if (hasNewChat && NEW_MESSAGES.length > 0) { h += sectionH(NEW_MESSAGES.length); sections++; }
  if (hasRecent) { if (sections > 0) h += OUTER_GAP; h += sectionH(RECENT_CHATS.length); }
  return h + FOOTER_TOTAL;
}

// ── Unified item component ────────────────────────────────────────────────────

interface NotchItemProps {
  icon?: React.ElementType;
  initials?: string;
  title: string;
  subtitle: string;
  trailing: string;
  badge?: number;
  onClick?: () => void;
}

function NotchItem({ icon: Icon, initials, title, subtitle, trailing, badge, onClick }: NotchItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg border border-border bg-background/60 px-3 py-3 cursor-pointer hover:bg-accent transition-colors"
    >
      {Icon && (
        <div className="flex items-center justify-center size-9 rounded-lg shrink-0 bg-accent">
          <Icon size={18} weight="duotone" className="text-foreground" />
        </div>
      )}
      {initials && (
        <span className="flex items-center justify-center size-7 rounded-full bg-muted text-[10px] font-semibold text-muted-foreground shrink-0 border border-border">
          {initials}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground truncate">{title}</p>
        <p className="text-[12px] text-muted-foreground truncate mt-0.5">{subtitle}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[11px] text-muted-foreground whitespace-nowrap">{trailing}</span>
        {badge ? (
          <span className="flex items-center justify-center size-4 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function NavButton({ label }: { label: string }) {
  return (
    <Button variant="outline" size="sm" className="h-8 text-[13px] w-full bg-muted/40">
      {label}
    </Button>
  );
}

function EmptyState({ icon: Icon, title, subtitle, cta }: {
  icon: React.ElementType; title: string; subtitle: string; cta: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full select-none">
      <Icon size={48} weight="regular" className="text-foreground mb-3" />
      <p className="text-[14px] font-medium text-foreground">{title}</p>
      <p className="text-[14px] text-muted-foreground mt-0.5">{subtitle}</p>
      <div className="w-full mt-3"><NavButton label={cta} /></div>
    </div>
  );
}

// ── Chat data ─────────────────────────────────────────────────────────────────

interface ChatMessage { id: string; source: string; preview: string; timestamp: string; unread?: number; }

export const NEW_MESSAGES: ChatMessage[] = [
  { id: 'n1', source: 'Dr. Sarah Okafor', preview: 'Please review the latest test results before the appointment tomorrow…', timestamp: 'just now', unread: 1 },
];

export const RECENT_CHATS: ChatMessage[] = [
  { id: 'r1', source: 'Margaret Ellison', preview: 'Thank you for updating my repeat prescription, I appreciate the quick turnaround…', timestamp: '8h' },
  { id: 'r2', source: 'A. Pendleton', preview: 'Can you confirm the Whitmore matter file review has been completed and sent…', timestamp: '11h' },
];

// ── Thread mock data ──────────────────────────────────────────────────────────

interface ThreadMsg { id: string; from: 'me' | 'them'; text: string; time: string; date: string; }

const MOCK_THREADS: Record<string, ThreadMsg[]> = {
  n1: [
    { id: '1', from: 'them', text: "Hi, checking in about Mr Whitmore's results. Have you had a chance to review them?", time: '09:14', date: '2026-10-22' },
    { id: '2', from: 'me',   text: 'Yes, reviewed this morning. Blood pressure slightly elevated but within range.', time: '09:31', date: '2026-10-22' },
    { id: '3', from: 'them', text: "Good. I'll adjust the medication plan before tomorrow's appointment.", time: '09:35', date: '2026-10-22' },
    { id: '4', from: 'them', text: 'Please review the latest test results before the appointment tomorrow.', time: '08:42', date: '2026-10-23' },
  ],
  r1: [
    { id: '1', from: 'them', text: 'Hello, I wanted to check on my repeat prescription for Metformin. It was due last week.', time: '14:20', date: '2026-10-22' },
    { id: '2', from: 'me',   text: "Hi Margaret, I can see your prescription here. I'll get it processed and sent to your pharmacy today.", time: '14:45', date: '2026-10-22' },
    { id: '3', from: 'them', text: 'Thank you for updating my repeat prescription, I appreciate the quick turnaround.', time: '15:02', date: '2026-10-22' },
  ],
  r2: [
    { id: '1', from: 'me',   text: "Arthur, the Whitmore file review is complete. I've flagged two items for your attention.", time: '10:15', date: '2026-10-22' },
    { id: '2', from: 'them', text: 'Thanks. Which items specifically?', time: '10:22', date: '2026-10-22' },
    { id: '3', from: 'me',   text: 'The conflict check checklist and the 14-day deadline diarisation. Both need sign-off.', time: '10:28', date: '2026-10-22' },
    { id: '4', from: 'them', text: 'Can you confirm the Whitmore matter file review has been completed and sent to the client?', time: '11:30', date: '2026-10-22' },
  ],
};

function formatDateLabel(iso: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (iso === today) return 'Today';
  if (iso === yesterday) return 'Yesterday';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Chat detail view ──────────────────────────────────────────────────────────

const BACK_ROW_H   = 32;
const GAP_SM       =  8;
const GAP_MD       = 16;
const INPUT_ROW_H  = 36;
const THREAD_H     = CHAT_DETAIL_H - BACK_ROW_H - GAP_SM - GAP_MD - INPUT_ROW_H; // 308

function ChatDetail({ chatId, onBack }: { chatId: string; onBack: () => void }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ThreadMsg[]>(MOCK_THREADS[chatId] ?? []);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  useEffect(() => { scrollToBottom(); }, []);
  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    const date = now.toISOString().slice(0, 10);
    setMessages(prev => [...prev, { id: String(Date.now()), from: 'me', text, time, date }]);
    setInput('');
  };

  // Group messages by date
  const groups: { date: string; msgs: ThreadMsg[] }[] = [];
  for (const msg of messages) {
    const last = groups[groups.length - 1];
    if (last && last.date === msg.date) last.msgs.push(msg);
    else groups.push({ date: msg.date, msgs: [msg] });
  }

  return (
    <div className="flex flex-col" style={{ height: CHAT_DETAIL_H }}>
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors self-start shrink-0"
        style={{ height: BACK_ROW_H }}
      >
        <ArrowLeft size={14} weight="bold" />
        <span>Back</span>
      </button>

      {/* Thread */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-3 overflow-y-auto"
        style={{ height: THREAD_H, marginTop: GAP_SM }}
      >
        {groups.map(group => (
          <div key={group.date} className="flex flex-col">
            {/* Date stamp */}
            <div className="flex justify-center mb-5">
              <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-0.5 rounded-full">
                {formatDateLabel(group.date)}
              </span>
            </div>
            {/* Messages */}
            <div className="flex flex-col gap-2">
            {group.msgs.map(msg => (
              <div key={msg.id} className={`flex flex-col gap-0.5 ${msg.from === 'me' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[75%] px-3 py-2 text-[13px] leading-snug ${
                    msg.from === 'me'
                      ? 'border border-border bg-muted/70 text-foreground rounded-2xl rounded-br-sm'
                      : 'border border-border text-foreground rounded-2xl rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
              </div>
            ))}
            </div>
          </div>
        ))}
      </div>

      {/* Send input row */}
      <div className="flex items-center gap-2" style={{ height: INPUT_ROW_H, marginTop: GAP_MD }}>
        <button
          className="flex items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
          style={{ height: INPUT_ROW_H, width: INPUT_ROW_H }}
        >
          <Plus size={15} weight="regular" />
        </button>
        <div className="flex-1 flex items-center rounded-lg border border-border bg-background/60 px-3 h-full">
          <input
            type="text"
            placeholder="Message…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="flex items-center justify-center rounded-lg border border-border bg-background/60 text-primary disabled:text-muted-foreground hover:bg-accent transition-colors shrink-0"
          style={{ height: INPUT_ROW_H, width: INPUT_ROW_H }}
        >
          <PaperPlaneRight size={15} weight="fill" />
        </button>
      </div>
    </div>
  );
}

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

// ── View router ───────────────────────────────────────────────────────────────

interface Notch3ViewProps {
  id: NavId3 | null;
  hasNotification?: boolean;
  hasNewChat?: boolean;
  hasCalendarEvent?: boolean;
  activeChatId?: string | null;
  onChatOpen?: (id: string) => void;
  onChatClose?: () => void;
}

export function Notch3View({ id, hasNotification, hasNewChat, hasCalendarEvent, activeChatId, onChatOpen, onChatClose }: Notch3ViewProps) {
  switch (id) {

    case 'notifications':
      return hasNotification ? (
        <div className="flex flex-col gap-4">
          <NotchItem icon={Bell} title="File review due" subtitle="Whitmore matter · 3 days overdue" trailing="2m ago" />
          <NavButton label="View all notifications" />
        </div>
      ) : (
        <EmptyState icon={Bell} title="No new notifications" subtitle="You're up-to-date" cta="View all notifications" />
      );

    case 'chat': {
      if (activeChatId) {
        return <ChatDetail chatId={activeChatId} onBack={() => onChatClose?.()} />;
      }
      const hasRecent = RECENT_CHATS.length > 0;
      if (!hasNewChat && !hasRecent) {
        return <EmptyState icon={ChatCircle} title="No recent messages" subtitle="Nothing in the last 24 hours" cta="Go to Message centre" />;
      }
      return (
        <div className="flex flex-col gap-4">
          {hasNewChat && NEW_MESSAGES.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-primary uppercase tracking-wider px-1">
                <span className="size-1.5 rounded-full bg-primary shrink-0" />
                {NEW_MESSAGES.length} New message{NEW_MESSAGES.length !== 1 ? 's' : ''}
              </p>
              {NEW_MESSAGES.map(msg => (
                <NotchItem key={msg.id} initials={getInitials(msg.source)} title={msg.source} subtitle={msg.preview} trailing={msg.timestamp} badge={msg.unread} onClick={() => onChatOpen?.(msg.id)} />
              ))}
            </div>
          )}
          {hasRecent && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Recent chats</p>
              {RECENT_CHATS.map(msg => (
                <NotchItem key={msg.id} initials={getInitials(msg.source)} title={msg.source} subtitle={msg.preview} trailing={msg.timestamp} onClick={() => onChatOpen?.(msg.id)} />
              ))}
            </div>
          )}
          <NavButton label="Go to Message centre" />
        </div>
      );
    }

    case 'tasks': {
      const dueToday = tasksDueToday();
      if (dueToday.length === 0) {
        return <EmptyState icon={CheckCircle} title="You're all caught up" subtitle="All today's tasks have been completed" cta="View all tasks" />;
      }
      return (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: MAX_VISIBLE_TASKS * ROW_H + (MAX_VISIBLE_TASKS - 1) * ROW_GAP }}>
            {dueToday.map(task => (
              <NotchItem
                key={task.id}
                icon={ListChecks}
                title={task.title}
                subtitle={`${task.ref}${task.assignee ? ` · ${ASSIGNEE_NAMES[task.assignee] ?? task.assignee}` : ''}`}
                trailing={task.priority ?? ''}
              />
            ))}
          </div>
          <NavButton label="View all tasks" />
        </div>
      );
    }

    case 'calendar':
      return hasCalendarEvent ? (
        <div className="flex flex-col gap-4">
          <NotchItem icon={CalendarBlank} title="Team standup" subtitle="With Dr. Shaw & team · Remote" trailing="In 15 min" />
          <NavButton label="Open calendar" />
        </div>
      ) : (
        <EmptyState icon={CalendarBlank} title="No upcoming events" subtitle="Enjoy the peace and quiet" cta="Open calendar" />
      );

    case 'record':    return <Placeholder title="Scribe" />;
    case 'knowledge': return <Placeholder title="Knowledge base" />;
    default:          return <Placeholder title="Notch 3" />;
  }
}
