export type IslandEventType =
  | 'notification'
  | 'appointment'
  | 'task'
  | 'alert'
  | 'background-complete';

export interface IslandEvent {
  id: string;
  type: IslandEventType;
  title: string;
  preview?: string;
  timestamp: Date;
  read: boolean;
}

export const MOCK_EVENTS: IslandEvent[] = [
  {
    id: '1',
    type: 'notification',
    title: 'File review due',
    preview: "It's nearly a month since the last review…",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Appointment in 15 mins',
    preview: 'Margaret Ellison — 10:45 AM',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
  },
  {
    id: '3',
    type: 'task',
    title: 'Task assigned to you',
    preview: 'Chase corrective actions — CON-2026-0626',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    read: true,
  },
];

export type TaskPriority = 'High' | 'Medium' | 'Low';
export interface IslandTask {
  id: string;
  title: string;
  priority: TaskPriority;
  matter: string;
  dueTime?: string;
}

export const MOCK_TODAY_TASKS: IslandTask[] = [
  {
    id: 'TSK-0041',
    title: 'Annual medication review — Margaret Ellison',
    priority: 'High',
    matter: 'Patient · OneView',
    dueTime: '10:45',
  },
  {
    id: 'TSK-0052',
    title: 'Chase corrective actions — Whitmore matter',
    priority: 'High',
    matter: 'CON-2026-0626 · Compliance',
    dueTime: '12:00',
  },
  {
    id: 'TSK-0058',
    title: 'Review draft settlement agreement v3',
    priority: 'Medium',
    matter: 'Hendricks · Litigation',
  },
];

export function formatRelative(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
