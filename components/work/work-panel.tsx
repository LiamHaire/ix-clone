"use client";

import { useState } from "react";
import { X, MagnifyingGlass, CaretDown, Check } from "@phosphor-icons/react";
import { useRef, useEffect } from "react";
import { WorkNav } from "./work-nav";
import { TaskBoard } from "./task-board";
import { SheetHeader } from "@/components/ui/sheet";
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
        <p className="font-heading text-base font-medium text-foreground leading-none">Work</p>
        <button
          onClick={onClose}
          className="flex items-center justify-center size-8 rounded-full text-sidebar-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </SheetHeader>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <WorkNav activeView={activeView} onViewChange={(v) => { setActiveView(v); setSearch(""); setFilter("all"); }} />

        {/* Vertical divider with 16px inset top and bottom */}
        <div className="w-px bg-border my-4 shrink-0" />

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden pl-4">
          {/* Toolbar */}
          {showTaskView && (
            <div className="flex items-center gap-2 pr-4 pt-4 pb-2.5 shrink-0">
              {/* Search */}
              <div className="relative flex-1 max-w-[240px]">
                <MagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tasks…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-7 pr-3 h-8 rounded-md border border-border bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>

              {/* Priority filter */}
              <div ref={priorityRef} className="relative">
                <button
                  onClick={() => setPriorityOpen(o => !o)}
                  className={cn(
                    "flex items-center gap-1.5 h-8 px-3 rounded-md border text-[13px] font-medium transition-colors",
                    !allSelected
                      ? "border-foreground text-foreground bg-background"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {priorityLabel}
                  <CaretDown size={12} />
                </button>
                {priorityOpen && (
                  <div className="absolute top-full left-0 mt-1 z-50 w-40 rounded-lg border border-border bg-popover shadow-md py-1">
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
  );
}
