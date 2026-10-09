'use client';

import { CaretDoubleUp, CaretUp, CaretDown, Warning } from '@phosphor-icons/react';
import type { PatientTask, TaskStatus, TaskPriority } from '@/lib/patientData';

// ── Status chip ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<TaskStatus, string> = {
  Draft:   'border-border bg-muted text-muted-foreground',
  Active:  'border-primary/40 bg-primary/8 text-primary',
  Due:     'border-warning/40 bg-warning/8 text-warning',
  Overdue: 'border-destructive/40 bg-destructive/8 text-destructive',
};

function StatusChip({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase whitespace-nowrap ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

// ── Priority icon button ──────────────────────────────────────────────────────

const PRIORITY_ICON: Record<TaskPriority, { Icon: React.ElementType; cls: string }> = {
  Low:    { Icon: CaretDown,      cls: 'text-muted-foreground' },
  Medium: { Icon: CaretUp,        cls: 'text-warning' },
  High:   { Icon: CaretDoubleUp,  cls: 'text-destructive' },
  Urgent: { Icon: Warning,        cls: 'text-destructive' },
};

function PriorityIcon({ priority }: { priority: TaskPriority }) {
  const { Icon, cls } = PRIORITY_ICON[priority];
  return (
    <span className={`inline-flex size-6 items-center justify-center rounded-full border border-border ${cls}`}>
      <Icon size={12} weight="bold" />
    </span>
  );
}

// ── Assignee avatar ───────────────────────────────────────────────────────────

const CHART_BG: Record<string, string> = {
  'chart-1': 'bg-chart-1',
  'chart-2': 'bg-chart-2',
  'chart-3': 'bg-chart-3',
  'chart-4': 'bg-chart-4',
  'chart-5': 'bg-chart-5',
};

function AssigneeAvatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span
      className={`inline-flex size-6 items-center justify-center rounded-full text-[10px] font-semibold text-background shrink-0 ${CHART_BG[color] ?? 'bg-muted'}`}
    >
      {initials}
    </span>
  );
}

// ── Single task row ───────────────────────────────────────────────────────────

function TaskRow({ task, onClick }: { task: PatientTask; onClick?: (task: PatientTask) => void }) {
  return (
    <div
      className="flex items-baseline gap-3 px-3 py-2.5 rounded-lg border border-border bg-background hover:bg-muted/40 cursor-pointer transition-colors group"
      onClick={() => onClick?.(task)}
    >
      {/* Left: ID + title — fills space, truncates */}
      <span className="text-[12px] font-medium text-muted-foreground shrink-0">{task.id}</span>
      <span className="text-[14px] font-semibold text-foreground truncate flex-1 min-w-0">{task.title}</span>

      {/* Right: date · status · priority · avatar · more — all baseline-aligned, shrink-0 */}
      <span className="text-[12px] text-muted-foreground whitespace-nowrap shrink-0">Due {task.dueDate}</span>
      <StatusChip status={task.status} />
      <PriorityIcon priority={task.priority} />
      <AssigneeAvatar initials={task.assignee.initials} color={task.assignee.color} />
    </div>
  );
}

// ── Exported list ─────────────────────────────────────────────────────────────

export function PatientTaskList({ tasks, onTaskClick }: { tasks: PatientTask[]; onTaskClick?: (task: PatientTask) => void }) {
  if (tasks.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      {tasks.map(task => <TaskRow key={task.id} task={task} onClick={onTaskClick} />)}
    </div>
  );
}
