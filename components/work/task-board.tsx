"use client";

import { CheckSquare, Plus, UserCircle } from "@phosphor-icons/react";
import { IconPriorityHigh } from "@/components/ui/iqons/IconPriorityHigh";
import { IconPriorityMedium } from "@/components/ui/iqons/IconPriorityMedium";
import { IconPriorityLow } from "@/components/ui/iqons/IconPriorityLow";
import { cn } from "@/lib/utils";
import { TASK_DATA, type Task, type Lane } from "./task-data";

// ── Priority icon ─────────────────────────────────────────────────────────────

function PriorityIcon({ priority }: { priority: Task["priority"] }) {
  if (priority === "high")   return <IconPriorityHigh   size={20} variant="duotone" className="text-destructive" />;
  if (priority === "medium") return <IconPriorityMedium size={20} variant="duotone" className="text-warning" />;
  return                            <IconPriorityLow    size={20} variant="duotone" className="text-muted-foreground" />;
}

// ── Task card ─────────────────────────────────────────────────────────────────

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 flex flex-col gap-2.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <p className="text-[14px] font-medium text-foreground leading-snug">{task.title}</p>
      {task.notes && (
        <p className="text-[14px] text-muted-foreground leading-relaxed line-clamp-3">{task.notes}</p>
      )}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border border-border text-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-1.5 justify-between">
        <div className="flex items-center gap-1.5">
          <CheckSquare size={13} weight="duotone" className="text-muted-foreground shrink-0" />
          <span className="text-[11px] text-muted-foreground font-mono">{task.ref}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <PriorityIcon priority={task.priority} />
          {task.assignee ? (
            <span className="flex items-center justify-center size-6 rounded-full bg-foreground text-background text-[10px] font-semibold">
              {task.assignee}
            </span>
          ) : (
            <UserCircle size={20} weight="duotone" className="text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Swimlane ──────────────────────────────────────────────────────────────────

function Swimlane({ lane, search, priorities }: { lane: Lane; search: string; priorities: Set<string> }) {
  const tasks = lane.tasks.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorities.has(t.priority);
    return matchSearch && matchPriority;
  });
  const isEmpty = tasks.length === 0;

  return (
    <div className="flex flex-col gap-2 min-w-0 flex-1">
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{lane.label}</span>
        <span className="text-xs text-muted-foreground font-medium">{tasks.length}</span>
      </div>
      <div className={cn(
        "flex flex-col gap-2 rounded-xl p-2 flex-1",
        "bg-secondary/60 border border-border",
        isEmpty && "border-dashed"
      )}>
        {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        <button className="flex items-center justify-center w-full py-1.5 mt-auto rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Board ─────────────────────────────────────────────────────────────────────

interface TaskBoardProps {
  search: string;
  priorities: Set<string>;
}

export function TaskBoard({ search, priorities }: TaskBoardProps) {
  return (
    <div className="flex gap-3 h-full overflow-x-auto p-4">
      {TASK_DATA.map(lane => <Swimlane key={lane.id} lane={lane} search={search} priorities={priorities} />)}
    </div>
  );
}
