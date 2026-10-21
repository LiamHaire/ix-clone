"use client";

import { CheckSquare, Plus, UserCircle } from "@phosphor-icons/react";
import { IconPriorityHigh } from "@/components/ui/iqons/IconPriorityHigh";
import { IconPriorityMedium } from "@/components/ui/iqons/IconPriorityMedium";
import { IconPriorityLow } from "@/components/ui/iqons/IconPriorityLow";
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

// ── Table view ────────────────────────────────────────────────────────────────

const COLUMNS: ColumnDef<Task, unknown>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-foreground truncate">{row.original.title}</span>
        {row.original.notes && (
          <span className="text-xs text-muted-foreground truncate">{row.original.notes}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'ref',
    header: 'Ref',
    size: 90,
    cell: ({ row }) => <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">{row.original.ref}</span>,
  },
  {
    id: 'lane',
    header: 'Status',
    size: 110,
    cell: ({ row }) => {
      const lane = TASK_DATA.find(l => l.tasks.some(t => t.id === row.original.id));
      return <span className="text-xs text-muted-foreground whitespace-nowrap">{lane?.label ?? '—'}</span>;
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    size: 80,
    cell: ({ row }) => <div className="flex justify-center"><PriorityIcon priority={row.original.priority} /></div>,
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    size: 130,
    cell: ({ row }) => (
      <div className="flex flex-nowrap gap-1">
        {(row.original.tags ?? []).map(tag => (
          <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border border-border text-foreground whitespace-nowrap">
            {tag}
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'assignee',
    header: 'Assignee',
    size: 90,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.assignee ? (
          <span className="flex items-center justify-center size-7 rounded-full bg-foreground text-background text-[11px] font-semibold">
            {row.original.assignee}
          </span>
        ) : (
          <UserCircle size={20} weight="duotone" className="text-muted-foreground" />
        )}
      </div>
    ),
  },
];

export function TaskTable({ search, priorities }: TaskBoardProps) {
  const allTasks = TASK_DATA.flatMap(l => l.tasks).filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase());
    return matchSearch && priorities.has(t.priority);
  });

  const table = useReactTable({
    data: allTasks,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="h-full overflow-y-auto pt-0 pb-4 pr-4 pl-0">
      <div className="rounded-xl border border-border overflow-hidden">
        <Table className="table-fixed w-full">
          <colgroup>
            <col />
            <col style={{ width: 90 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 90 }} />
          </colgroup>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id} className="border-b border-border hover:bg-transparent bg-muted/40">
                {hg.headers.map(header => (
                  <TableHead key={header.id} className={`h-9 px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap ${ ['priority','assignee'].includes(header.column.id) ? 'text-center' : '' }`}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} className="py-12 text-center text-sm text-muted-foreground">
                  No tasks match your filter.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="border-b border-border last:border-0 hover:bg-accent transition-colors cursor-pointer">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="py-3 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
