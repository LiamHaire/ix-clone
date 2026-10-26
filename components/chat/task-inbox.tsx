'use client';

import { TabbedList } from '@/components/ui/tabbed-list';
import { TaskPreviewItem } from '@/components/ui/task-preview-item';

// ── Mock data ─────────────────────────────────────────────────────────────────

const TODAY_TASKS = [
  { id: '1', title: 'Review Whitmore file before client call', description: 'Check conflict checklist and 14-day diarisation before sign-off.', timestamp: 'Due 2pm', priority: 'high' as const, tags: ['Legal'] },
  { id: '2', title: 'Process repeat prescription — Ellison', description: 'Metformin repeat. Patient has chased. Send to pharmacy today.', timestamp: 'Due 4pm', priority: 'high' as const, tags: ['Clinical'] },
  { id: '3', title: 'Update patient notes for Dr. Moss', description: 'Add revised medication plan from last week\'s review.', timestamp: 'Due 5pm', priority: 'medium' as const },
];

const OVERDUE_TASKS = [
  { id: '4', title: 'Complete annual compliance training', description: 'Mandatory training module. Deadline passed 3 days ago.', timestamp: '3d overdue', priority: 'high' as const },
  { id: '5', title: 'File review — Pendleton matter', description: 'Outstanding file review flagged by fee earner last week.', timestamp: '1d overdue', priority: 'medium' as const, tags: ['Legal'] },
];

const ALL_TASKS = [
  ...TODAY_TASKS,
  ...OVERDUE_TASKS,
  { id: '6', title: 'Book follow-up appointment — Whitmore', description: 'Schedule 4-week follow-up after medication change.', timestamp: 'Tomorrow', priority: 'medium' as const, tags: ['Clinical'] },
  { id: '7', title: 'Draft client update email — Pendleton', description: 'Summary of file review findings for client sign-off.', timestamp: 'This week', priority: 'low' as const },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function TaskInbox() {
  const overdueCount = OVERDUE_TASKS.length;
  const todayCount   = TODAY_TASKS.length;

  return (
    <TabbedList
      title="Task inbox"
      subtitle={`${todayCount} due today${overdueCount > 0 ? `, ${overdueCount} overdue` : ''}`}
      defaultTab="today"
      tabs={[
        {
          id: 'today',
          label: 'Due today',
          items: TODAY_TASKS.map(task => (
            <TaskPreviewItem key={task.id} {...task} onClick={() => {}} />
          )),
        },
        {
          id: 'overdue',
          label: 'Overdue',
          items: OVERDUE_TASKS.map(task => (
            <TaskPreviewItem key={task.id} {...task} onClick={() => {}} />
          )),
        },
        {
          id: 'all',
          label: 'All tasks',
          items: ALL_TASKS.map(task => (
            <TaskPreviewItem key={task.id} {...task} onClick={() => {}} />
          )),
        },
      ]}
    />
  );
}
