"use client";

import { useState } from "react";
import { X, Check, ListChecks } from "@phosphor-icons/react";
import { useRef, useEffect } from "react";
import { WorkNav } from "./work-nav";
import { TaskBoard } from "./task-board";
import { SheetHeader } from "@/components/ui/sheet";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { cn } from "@/lib/utils";

interface WorkPanelProps {
  onClose: () => void;
}

export function WorkPanel({ onClose }: WorkPanelProps) {
  const [activeView, setActiveView] = useState<string>("my-tasks");
  const [search, setSearch] = useState("");
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

  return (
    <div className="h-full flex flex-col border-r border-border bg-popover">
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
        <div className="flex flex-1 min-h-0 overflow-hidden max-w-[1200px] mx-auto w-full">
        <WorkNav activeView={activeView} onViewChange={(v) => { setActiveView(v); setSearch(""); }} />

        {/* Vertical divider with 16px inset top and bottom */}
        <div className="w-px bg-border my-4 shrink-0" />

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden pl-4">
          {/* Toolbar */}
          {showTaskView && (
            <div ref={priorityRef} className="relative shrink-0">
              <TableToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Filter by title, ref…"
                onFilter={() => setPriorityOpen(o => !o)}
                filterActive={!allSelected}
                className="pr-4 pt-4 pb-2.5 pl-0 border-none"
              />
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
            {showTaskView && <TaskBoard search={search} priorities={priorities} />}
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
