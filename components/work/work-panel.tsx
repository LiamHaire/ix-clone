"use client";

import { useState } from "react";
import { X, Check, ListChecks, Columns, Table as TableIcon, ClockCounterClockwise, ArrowFatUp, WarningCircle, Plus, Funnel, MagnifyingGlass } from "@phosphor-icons/react";
import { useRef, useEffect, useMemo } from "react";
import { WorkNav } from "./work-nav";
import { TaskBoard, TaskTable } from "./task-board";
import { SheetHeader } from "@/components/ui/sheet";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { Button } from "@/components/ui/button";
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

  const CATEGORIES = [
    "Admin", "Annual prescribing", "Book appointment", "Clinical",
    "Contact patient", "Diabetes review", "Documents", "Follow up",
    "Home visit", "Immunisation", "Mail", "Medication review",
    "Mental health review", "Other",
  ];
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [categorySearch, setCategorySearch] = useState("");

  function toggleCategory(cat: string) {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }
  const allCategoriesSelected = selectedCategories.size === 0;
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
    <div className="h-full flex flex-col" style={{ background: 'var(--nav-rail-bg)' }}>
      <SheetHeader className="px-4 pt-4 pb-3 flex-row items-center justify-between gap-2 shrink-0 border-b border-border">
        <div className="flex items-center gap-2">
          <ListChecks size={16} weight="duotone" className="text-muted-foreground shrink-0" />
          <p className="font-heading text-base font-medium text-foreground leading-none">Work</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-2.5 h-8 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label="New task"
          >
            <Plus size={13} weight="bold" />
            New Task
          </button>
          {/* TODO: reinstate close button — temporarily hidden 2026-10-21 */}
        </div>
      </SheetHeader>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={`flex flex-1 min-h-0 overflow-hidden mx-auto w-full ${expanded ? 'max-w-[1600px]' : 'max-w-[1200px]'}`} style={{ transition: 'max-width var(--dur-panel-resize) var(--ease-out-expo)' }}>
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
                <div key={label} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-popover px-4 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[18px] font-bold text-foreground leading-none tabular-nums">{value}</span>
                    <span className="text-sm text-muted-foreground truncate">{label}</span>
                  </div>
                  <div className="shrink-0">{icon}</div>
                </div>
              ))}
            </div>
          )}

          {/* Toolbar */}
          {showTaskView && (
            <div className="flex items-center gap-2 pr-4 pt-4 pb-2.5 pl-0 shrink-0">
              <TableToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search by title, ref…"
                sortOptions={["Due date", "Status", "Priority", "Assignee"]}
                sortValue={sortBy}
                onSortChange={setSortBy}
                className="flex-1 p-0 border-none"
              />

              {/* Filter button — popover anchors to this div */}
              <div ref={priorityRef} className="relative shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setPriorityOpen(o => !o)}
                  className={cn(
                    "gap-1.5 shrink-0",
                    (priorityOpen || !allSelected) && "border-foreground text-foreground"
                  )}
                >
                  <Funnel size={14} />
                  Filter
                </Button>

                {priorityOpen && (
                  <div className="absolute top-full right-0 mt-1 z-50 flex flex-col rounded-lg border border-border bg-popover shadow-md overflow-hidden">
                    {/* Columns row */}
                    <div className="flex">
                      {/* Priority column */}
                      <div className="w-36 py-1 border-r border-border shrink-0">
                        <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</p>
                        <div className="w-full h-px bg-border mb-1" />
                        {(["high", "medium", "low"] as const).map(p => (
                          <button
                            key={p}
                            onClick={() => togglePriority(p)}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-foreground hover:bg-accent transition-colors"
                          >
                            <span className={cn(
                              "flex items-center justify-center size-4 rounded border transition-colors shrink-0",
                              priorities.has(p) ? "bg-foreground border-foreground" : "border-border"
                            )}>
                              {priorities.has(p) && <Check size={10} className="text-background" weight="bold" />}
                            </span>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </button>
                        ))}
                      </div>

                      {/* Category column */}
                      <div className="w-48 py-1 flex flex-col">
                        <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</p>
                        <div className="w-full h-px bg-border mb-1" />
                        {/* Sticky search */}
                        <div className="px-2 pb-1 sticky top-0 bg-popover z-10">
                          <div className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 h-7">
                            <MagnifyingGlass size={12} className="text-muted-foreground shrink-0" />
                            <input
                              type="text"
                              placeholder="Search…"
                              value={categorySearch}
                              onChange={e => setCategorySearch(e.target.value)}
                              className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground outline-none min-w-0"
                            />
                            {categorySearch && (
                              <button onClick={() => setCategorySearch("")} className="text-muted-foreground hover:text-foreground shrink-0">
                                <X size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedCategories(new Set())}
                          className={cn(
                            "flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-foreground hover:bg-accent transition-colors shrink-0",
                            categorySearch ? "hidden" : ""
                          )}
                        >
                          <span className={cn(
                            "flex items-center justify-center size-4 rounded border transition-colors shrink-0",
                            allCategoriesSelected ? "bg-foreground border-foreground" : "border-border"
                          )}>
                            {allCategoriesSelected && <Check size={10} className="text-background" weight="bold" />}
                          </span>
                          All
                        </button>
                        <div className="overflow-y-auto" style={{ maxHeight: `${7 * 32}px` }}>
                          {CATEGORIES.filter(cat => cat.toLowerCase().includes(categorySearch.toLowerCase())).map(cat => (
                            <button
                              key={cat}
                              onClick={() => toggleCategory(cat)}
                              className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-foreground hover:bg-accent transition-colors"
                            >
                              <span className={cn(
                                "flex items-center justify-center size-4 rounded border transition-colors shrink-0",
                                selectedCategories.has(cat) ? "bg-foreground border-foreground" : "border-border"
                              )}>
                                {selectedCategories.has(cat) && <Check size={10} className="text-background" weight="bold" />}
                              </span>
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-border px-3 py-2 flex justify-end">
                      <button
                        onClick={() => { setPriorities(new Set(["high", "medium", "low"])); setSelectedCategories(new Set()); }}
                        className="px-2.5 py-1 text-xs font-medium rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Layout toggles */}
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
          )}

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-hidden mr-4 mb-4">
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
