"use client";

import { useState } from "react";
import { X, Check, ListChecks, Columns, Table as TableIcon, ClockCounterClockwise, ArrowFatUp, WarningCircle } from "@phosphor-icons/react";
import { useRef, useEffect, useMemo } from "react";
import { WorkNav } from "./work-nav";
import { TaskBoard, TaskTable } from "./task-board";
import { SheetHeader } from "@/components/ui/sheet";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { TASK_DATA } from "./task-data";
import { cn } from "@/lib/utils";

interface WorkPanelProps {
  onClose: () => void;
  expanded?: boolean;
}

export function WorkPanel({ onClose, expanded }: WorkPanelProps) {
  const [activeView, setActiveView] = useState<string>("my-tasks");
  const [layoutMode, setLayoutMode] = useState<'columns' | 'table'>('table');
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Due date");
  const [priorities, setPriorities] = useState<Set<string>>(new Set(["high", "medium", "low"]));
  const [priorityOpen, setPriorityOpen] = useState(false);
  const priorityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) {
        setPriorityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function togglePriority(p: string) {
    setPriorities(prev => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      if (next.size === 0) return prev;
      return next;
    });
  }

  const allSelected = priorities.size === 3;
  const priorityLabel = allSelected ? "Priority" : [...priorities].map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ");

  const showTaskView = activeView === "my-tasks";

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const all = TASK_DATA.flatMap(l => l.tasks);
    return {
      total:    all.length,
      pending:  TASK_DATA.find(l => l.id === 'due')?.tasks.length ?? 0,
      priority: all.filter(t => t.priority === 'high').length,
      overdue:  all.filter(t => t.dueDate && t.dueDate <= today).length,
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-popover">
      <SheetHeader className="px-4 pt-4 pb-3 flex-row items-center justify-between gap-2 shrink-0 border-b border-border">
        <div className="flex items-center gap-2">
          <ListChecks size={16} weight="duotone" className="text-muted-foreground shrink-0" />
          <p className="font-heading text-base font-medium text-foreground leading-none">Work</p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center size-8 rounded-full text-sidebar-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </SheetHeader>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={`flex flex-1 min-h-0 overflow-hidden mx-auto w-full ${expanded ? 'max-w-[1600px]' : 'max-w-[1200px]'}`} style={{ transition: 'max-width 500ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <WorkNav activeView={activeView} onViewChange={(v) => { setActiveView(v); setSearch(""); }} />

        {/* Vertical divider with 16px inset top and bottom */}
        <div className="w-px bg-border my-4 shrink-0" />

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden pl-4">
          {/* Stat tiles */}
          {showTaskView && (
            <div className="grid grid-cols-4 gap-3 pt-4 pr-4 shrink-0">
              {[
                { label: 'Total tasks',    value: stats.total,    icon: <ListChecks size={18} weight="duotone" className="text-emerald-500" /> },
                { label: 'Pending tasks',  value: stats.pending,  icon: <ClockCounterClockwise size={18} weight="duotone" className="text-blue-500" /> },
                { label: 'Priority tasks', value: stats.priority, icon: <ArrowFatUp size={18} weight="duotone" className="text-amber-500" /> },
                { label: 'Overdue tasks',  value: stats.overdue,  icon: <WarningCircle size={18} weight="duotone" className="text-destructive" /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-4 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[22px] font-bold text-foreground leading-none tabular-nums">{value}</span>
                    <span className="text-sm text-muted-foreground truncate">{label}</span>
                  </div>
                  <div className="shrink-0">{icon}</div>
                </div>
              ))}
            </div>
          )}

          {/* Toolbar */}
          {showTaskView && (
            <div ref={priorityRef} className="relative shrink-0">
              <div className="flex items-center gap-2 pr-4 pt-4 pb-2.5 pl-0">
              <TableToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Filter by title, ref…"
                sortOptions={["Due date", "Status", "Priority", "Assignee"]}
                sortValue={sortBy}
                onSortChange={setSortBy}
                onFilter={() => setPriorityOpen(o => !o)}
                filterActive={!allSelected}
                className="flex-1 p-0 border-none"
              />
              <div className="flex items-center rounded-md border border-border overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setLayoutMode('columns')}
                  className={cn('flex items-center justify-center size-8 transition-colors', layoutMode === 'columns' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent')}
                  aria-label="Column view"
                >
                  <Columns size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode('table')}
                  className={cn('flex items-center justify-center size-8 transition-colors', layoutMode === 'table' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent')}
                  aria-label="Table view"
                >
                  <TableIcon size={14} />
                </button>
              </div>
              </div>
              {priorityOpen && (
                <div className="absolute top-full right-4 mt-1 z-50 w-40 rounded-lg border border-border bg-popover shadow-md py-1">
                  <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</p>
                  <div className="w-full h-px bg-border mb-1" />
                  {(["high", "medium", "low"] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => togglePriority(p)}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-foreground hover:bg-accent transition-colors"
                    >
                      <span className={cn(
                        "flex items-center justify-center size-4 rounded border transition-colors",
                        priorities.has(p) ? "bg-foreground border-foreground" : "border-border"
                      )}>
                        {priorities.has(p) && <Check size={10} className="text-background" weight="bold" />}
                      </span>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {showTaskView && layoutMode === 'columns' && <TaskBoard search={search} priorities={priorities} />}
            {showTaskView && layoutMode === 'table'   && <TaskTable search={search} priorities={priorities} sortBy={sortBy} />}
            {!showTaskView && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Select a view from the left</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
