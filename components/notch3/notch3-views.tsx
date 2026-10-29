'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCircle, CalendarBlank, ListChecks, ChatCircle, ArrowLeft, PaperPlaneRight, Plus, Microphone, Timer, PencilSimpleLine, ShareNetwork, MagnifyingGlass } from '@phosphor-icons/react';
import { IconPriorityHigh } from '@/components/ui/iqons/IconPriorityHigh';
import { IconPriorityMedium } from '@/components/ui/iqons/IconPriorityMedium';
import { IconPriorityLow } from '@/components/ui/iqons/IconPriorityLow';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { N3Tooltip, type NavId3 } from './notch3-nav';
import { TASK_DATA, ASSIGNEE_NAMES, type Task } from '@/components/work/task-data';
import { Button } from '@/components/ui/button';

// ── Height model ──────────────────────────────────────────────────────────────

export const ROW_H           = 67;
export const ROW_GAP         =  8;
const SECTION_LABEL_H        = 20;
const OUTER_GAP              = 16;
const FOOTER_BTN_H           = 40;
const FOOTER_TOTAL           = OUTER_GAP + FOOTER_BTN_H; // 56
const CHAT_ROW_H             = 44;
const MAX_VISIBLE_CHATS      =  5;
const MAX_VISIBLE_TASKS      =  3;
export const EMPTY_H         = 148;
export const CHAT_DETAIL_H   = 400;

// Back-compat aliases
export const TASK_ROW_H    = ROW_H;
export const TASK_ROW_GAP  = ROW_GAP;
export const TASKS_EMPTY_H = EMPTY_H;
export const CHAT_EMPTY_H  = EMPTY_H;

const QUICK_ACTION_BTN_SIZE = 48;
export const QUICK_ACTIONS_H = QUICK_ACTION_BTN_SIZE;

export const VIEW_HEIGHTS_3: Record<NavId3, number> = {
  notifications: EMPTY_H,
  chat:          EMPTY_H,
  tasks:         EMPTY_H,
  calendar:      EMPTY_H,
  quickactions:  QUICK_ACTIONS_H,
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
  return SECTION_LABEL_H + n * CHAT_ROW_H;
}

const CHAT_ROW_GAP = 4;  // gap-1
const CHAT_BTN_MT  = 8;  // mt-2 before footer button

export function chatContentHeight(_hasNewChat: boolean, activeChatId?: string | null): number {
  if (activeChatId) return CHAT_DETAIL_H;
  const count = Math.min(RECENT_CHATS.length, MAX_VISIBLE_CHATS);
  if (count === 0) return EMPTY_H;
  // gap-1 applies between all children including the button div, so `count` gaps not `count - 1`
  return count * CHAT_ROW_H + count * CHAT_ROW_GAP + CHAT_BTN_MT + FOOTER_BTN_H;
}

// ── Unified item component ────────────────────────────────────────────────────

interface NotchItemProps {
  icon?: React.ElementType;
  initials?: string;
  title: string;
  subtitle: string;
  trailing?: string;
  chip?: string;
  badge?: number;
  onClick?: () => void;
}

function PriorityIcon({ priority }: { priority?: string }) {
  if (priority === 'high')   return <IconPriorityHigh   size={16} variant="duotone" className="text-destructive" />;
  if (priority === 'medium') return <IconPriorityMedium size={16} variant="duotone" className="text-warning" />;
  if (priority === 'low')    return <IconPriorityLow    size={16} variant="duotone" className="text-muted-foreground" />;
  return null;
}

function NotchItem({ icon: Icon, initials, title, subtitle, trailing, chip, badge, onClick }: NotchItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg border bg-background/60 px-3 py-3 cursor-pointer hover:bg-accent transition-colors" style={{ borderColor: 'var(--notch-tile-border, var(--border))' }}
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
        {trailing && <span className="text-xs text-muted-foreground whitespace-nowrap">{trailing}</span>}
        {chip && <PriorityIcon priority={chip.toLowerCase()} />}
        {badge ? (
          <span className="flex items-center justify-center size-4 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function NavButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Button variant="outline" size="sm" className="h-10 text-[13px] w-full bg-muted/40" onClick={onClick}>
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

export const RECENT_CHATS: ChatMessage[] = [
  { id: 'n1', source: 'Dr. Sarah Okafor', preview: 'Please review the latest test results before the appointment tomorrow…', timestamp: '11h' },
  { id: 'r1', source: 'Margaret Ellison', preview: 'Thank you for updating my repeat prescription, I appreciate the quick turnaround…', timestamp: '18h' },
  { id: 'r2', source: 'A. Pendleton', preview: 'Can you confirm the Whitmore matter file review has been completed and sent…', timestamp: '19h' },
  { id: 'r3', source: 'James Whitmore', preview: 'Happy to sign off on both items, let me know when the file is ready to send…', timestamp: '1d' },
  { id: 'r4', source: 'Dr. Claire Moss', preview: 'The patient notes have been updated with the revised medication plan…', timestamp: '2d' },
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
                  className={`max-w-[75%] px-3 py-2 text-[13px] leading-snug border text-foreground ${
                    msg.from === 'me'
                      ? 'rounded-2xl rounded-br-sm'
                      : 'rounded-2xl rounded-bl-sm'
                  }`}
                  style={{
                    borderColor: 'var(--notch-tile-border, var(--border))',
                    background: msg.from === 'me'
                      ? 'linear-gradient(color-mix(in srgb, var(--accent) 50%, transparent), color-mix(in srgb, var(--accent) 50%, transparent)), color-mix(in srgb, var(--background) 60%, transparent)'
                      : 'color-mix(in srgb, var(--background) 60%, transparent)',
                  }}
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

function ChatRow({ msg, onClick }: { msg: ChatMessage; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full rounded-lg border px-3 py-2 bg-background/60 hover:bg-accent transition-colors text-left"
      style={{ height: CHAT_ROW_H, borderColor: 'var(--notch-tile-border, var(--border))' }}
    >
      <span className="flex items-center justify-center size-7 rounded-full bg-muted text-[10px] font-semibold text-muted-foreground shrink-0 border border-border">
        {getInitials(msg.source)}
      </span>
      <span className="flex-1 min-w-0 text-[13px] text-foreground truncate">
        <span className="font-semibold">{msg.source}</span>
        <span className="text-muted-foreground"> · </span>
        <span className="text-muted-foreground">{msg.preview}</span>
      </span>
      <span className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-muted-foreground whitespace-nowrap">· {msg.timestamp}</span>
        {msg.unread ? (
          <span className="flex items-center justify-center size-5 rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">
            {msg.unread}
          </span>
        ) : null}
      </span>
    </button>
  );
}

// ── Quick actions ─────────────────────────────────────────────────────────────

export type QuickActionId = 'record' | 'knowledge' | 'timer' | 'message' | 'share' | 'search';

const QUICK_ACTIONS: { id: QuickActionId; label: string; icon: React.ElementType }[] = [
  { id: 'record',    label: 'Start Scribe',  icon: Microphone      },
  { id: 'knowledge', label: 'Add',            icon: Plus            },
  { id: 'timer',     label: 'Start timer',   icon: Timer           },
  { id: 'message',   label: 'New message',   icon: PencilSimpleLine },
  { id: 'share',     label: 'Share',         icon: ShareNetwork    },
  { id: 'search',    label: 'Search',        icon: MagnifyingGlass },
];

function QuickActionsView({ onAction, isRecording }: { onAction?: (id: QuickActionId) => void; isRecording?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4">
      {QUICK_ACTIONS.map(action => {
        const Icon = action.icon;
        const active = action.id === 'record' && isRecording;
        const label = active ? 'Stop Scribe' : action.label;
        return (
          <N3Tooltip key={action.id} label={label}>
            <TooltipPrimitive.Trigger
              delay={300}
              closeDelay={100}
              aria-label={label}
              onClick={() => onAction?.(action.id)}
              className={[
                'relative flex items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'border-destructive text-destructive bg-destructive/10'
                  : 'text-muted-foreground hover:border-foreground hover:text-foreground hover:bg-accent',
              ].join(' ')}
              style={{ width: QUICK_ACTION_BTN_SIZE, height: QUICK_ACTION_BTN_SIZE, borderColor: active ? undefined : 'var(--muted-foreground)' }}
            >
              <Icon size={24} weight={active ? 'fill' : 'regular'} />
              {active && (
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-destructive animate-pulse" />
              )}
            </TooltipPrimitive.Trigger>
          </N3Tooltip>
        );
      })}
    </div>
  );
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
  onQuickAction?: (id: QuickActionId) => void;
  isRecording?: boolean;
  onNavigateWork?: () => void;
}

export function Notch3View({ id, hasNotification, hasNewChat, hasCalendarEvent, activeChatId, onChatOpen, onChatClose, onQuickAction, isRecording, onNavigateWork }: Notch3ViewProps) {
  switch (id) {

    case 'quickactions':
      return <QuickActionsView onAction={onQuickAction} isRecording={isRecording} />;

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
      if (RECENT_CHATS.length === 0) {
        return <EmptyState icon={ChatCircle} title="No recent messages" subtitle="Nothing in the last 24 hours" cta="Go to Message centre" />;
      }
      const displayChats = RECENT_CHATS.slice(0, MAX_VISIBLE_CHATS).map((chat, i) =>
        i === 0 && hasNewChat ? { ...chat, unread: 1, timestamp: 'just now' } : chat
      );
      return (
        <div className="flex flex-col gap-1">
          {displayChats.map(msg => (
            <ChatRow key={msg.id} msg={msg} onClick={() => onChatOpen?.(msg.id)} />
          ))}
          <div className="mt-2"><NavButton label="Go to Message centre" /></div>
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
                chip={task.priority}
                onClick={onNavigateWork}
              />
            ))}
          </div>
          <NavButton label="View all tasks" onClick={onNavigateWork} />
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

    default:          return <Placeholder title="Notch 3" />;
  }
}
