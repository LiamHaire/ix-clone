"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Plus, UserCircle, DotsThree, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { IconPriorityHigh } from "@/components/ui/iqons/IconPriorityHigh";
import { IconPriorityMedium } from "@/components/ui/iqons/IconPriorityMedium";
import { IconPriorityLow } from "@/components/ui/iqons/IconPriorityLow";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssigneeAvatar } from "./assignee-avatar";
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
    <div className="rounded-lg border border-border bg-popover p-3 flex flex-col gap-2.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
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
            <AssigneeAvatar initials={task.assignee} size="sm" />
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

const LANE_ORDER: Record<string, number> = { due: 0, inprogress: 1, blocked: 2 };
const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

interface TaskBoardProps {
  search: string;
  priorities: Set<string>;
  sortBy?: string;
}

export function TaskBoard({ search, priorities }: TaskBoardProps) {
  return (
    <div className="flex gap-3 h-full overflow-x-auto p-4">
      {TASK_DATA.map(lane => <Swimlane key={lane.id} lane={lane} search={search} priorities={priorities} />)}
    </div>
  );
}

// ── Table view ────────────────────────────────────────────────────────────────

function formatDue(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function TaskTable({ search, priorities, sortBy = 'Due date' }: TaskBoardProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const allTasks = TASK_DATA.flatMap(lane =>
    lane.tasks.map(t => ({ ...t, laneLabel: lane.label, laneId: lane.id }))
  ).filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase());
    return matchSearch && priorities.has(t.priority);
  }).sort((a, b) => {
    if (sortBy === 'Due date') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortBy === 'Status')   return (LANE_ORDER[a.laneId] ?? 9) - (LANE_ORDER[b.laneId] ?? 9);
    if (sortBy === 'Priority') return (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9);
    if (sortBy === 'Assignee') return (a.assignee ?? '').localeCompare(b.assignee ?? '');
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(allTasks.length / pageSize));

  // Reset to page 1 when filters/sort change
  useEffect(() => { setPage(1); }, [search, sortBy, pageSize]);
  useEffect(() => { setPage(p => Math.min(p, totalPages)); }, [totalPages]);

  const pageRows = allTasks.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="h-full overflow-y-auto pb-4">
      <div className="rounded-lg border border-border overflow-hidden flex flex-col bg-popover">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent bg-muted/40">
              <TableHead className="h-9 px-4 text-xs font-semibold text-muted-foreground w-full">Title</TableHead>
              <TableHead className="h-9 px-4 text-xs font-semibold text-muted-foreground w-[110px]">Type</TableHead>
              <TableHead className="h-9 px-4 text-xs font-semibold text-muted-foreground text-center w-[80px]">Priority</TableHead>
              <TableHead className="h-9 px-4 text-xs font-semibold text-muted-foreground w-[110px]">Status</TableHead>
              <TableHead className="h-9 px-4 text-xs font-semibold text-muted-foreground w-[120px]">Date received</TableHead>
              <TableHead className="h-9 px-4 text-xs font-semibold text-muted-foreground w-[120px]">Due date</TableHead>
              <TableHead className="h-9 px-4 text-xs font-semibold text-muted-foreground text-center w-[80px]">Assignee</TableHead>
              <TableHead className="h-9 w-[48px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No tasks match your filter.
                </TableCell>
              </TableRow>
            ) : pageRows.map(task => (
              <TableRow key={task.id} className="border-b border-border last:border-0 hover:bg-accent transition-colors cursor-pointer">
                <TableCell className="py-3 px-4 min-w-0 max-w-0">
                  <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                    <span className="text-sm font-medium text-foreground truncate">{task.title}</span>
                    {task.notes && <span className="text-xs text-muted-foreground truncate">{task.notes}</span>}
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{task.type}</span>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="flex justify-center"><PriorityIcon priority={task.priority} /></div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{task.laneLabel}</span>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDue(task.dateReceived)}</span>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDue(task.dueDate)}</span>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="flex justify-center">
                    {task.assignee
                      ? <AssigneeAvatar initials={task.assignee} size="md" />
                      : <UserCircle size={20} weight="duotone" className="text-muted-foreground" />}
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <DotsThree size={16} weight="bold" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page</span>
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center justify-center size-7 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Previous page"
            >
              <CaretLeft size={13} weight="bold" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center justify-center size-7 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Next page"
            >
              <CaretRight size={13} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
