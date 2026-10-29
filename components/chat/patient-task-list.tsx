'use client';

import { NotchItem, type NotchItemPriority, type NotchItemStatusTone } from '@/components/ui/notch-item';
import type { PatientTask, TaskStatus, TaskPriority } from '@/lib/patientData';

const STATUS_TONE: Record<TaskStatus, NotchItemStatusTone> = {
  Draft:   'muted',
  Active:  'primary',
  Due:     'warning',
  Overdue: 'destructive',
};

const PRIORITY: Record<TaskPriority, NotchItemPriority> = {
  Low:    'low',
  Medium: 'medium',
  High:   'high',
  Urgent: 'high',
};

export function PatientTaskList({ tasks, onTaskClick }: { tasks: PatientTask[]; onTaskClick?: (task: PatientTask) => void }) {
  if (tasks.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      {tasks.map(task => (
        <NotchItem
          key={task.id}
          type="task"
          bordered
          taskRef={task.id}
          title={task.title}
          description={`Due ${task.dueDate} · ${task.assignee.name}`}
          status={task.status}
          statusTone={STATUS_TONE[task.status]}
          priority={PRIORITY[task.priority]}
          onClick={onTaskClick ? () => onTaskClick(task) : undefined}
        />
      ))}
    </div>
  );
}
