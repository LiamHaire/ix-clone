"use client";

import { useState } from "react";
import {
  ListChecks,
  FileText,
  Briefcase,
  Users,
  ChartBar,
  Tag,
  Funnel,
  CaretRight,
  CaretDown,
} from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavLeaf {
  kind: "leaf";
  id: string;
  label: string;
}

interface NavBranch {
  kind: "branch";
  id: string;
  label: string;
  icon: React.ElementType;
  children: NavLeaf[];
}

interface NavItem {
  kind: "item";
  id: string;
  label: string;
  icon: React.ElementType;
}

type NavEntry = NavBranch | NavItem;

interface NavSection {
  title: string;
  entries: NavEntry[];
}

interface WorkNavProps {
  activeView: string;
  onViewChange: (id: string) => void;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const NAV: NavSection[] = [
  {
    title: "Tasks",
    entries: [
      { kind: "item", id: "my-tasks", label: "My tasks", icon: ListChecks },
      { kind: "item", id: "assigned",  label: "Assigned to me", icon: Users    },
      { kind: "item", id: "by-matter", label: "By matter",      icon: Briefcase },
      { kind: "item", id: "by-tag",    label: "By tag",         icon: Tag       },
    ],
  },
  {
    title: "Workflows",
    entries: [
      {
        kind: "branch",
        id: "active-workflows",
        label: "Active",
        icon: Funnel,
        children: [
          { kind: "leaf", id: "wf-inprogress", label: "In progress"    },
          { kind: "leaf", id: "wf-awaiting",   label: "Awaiting input" },
          { kind: "leaf", id: "wf-overdue",    label: "Overdue"        },
        ],
      },
      { kind: "item", id: "wf-templates", label: "Templates", icon: FileText  },
      { kind: "item", id: "wf-matter",    label: "By matter", icon: Briefcase },
      { kind: "item", id: "wf-reporting", label: "Reporting", icon: ChartBar  },
    ],
  },
];

// ── Components ────────────────────────────────────────────────────────────────

function NavLeafItem({ leaf, active, onSelect }: { leaf: NavLeaf; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left pl-8 pr-3 py-1.5 text-sm rounded-md transition-colors",
        active
          ? "bg-accent text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
    >
      {leaf.label}
    </button>
  );
}

function NavBranchItem({ entry, activeView, onViewChange }: { entry: NavBranch; activeView: string; onViewChange: (id: string) => void }) {
  const isChildActive = entry.children.some(c => c.id === activeView);
  const [open, setOpen] = useState(entry.id === activeView || isChildActive);
  const Icon = entry.icon;
  const isActive = activeView === entry.id;

  return (
    <div>
      <button
        onClick={() => { setOpen(!open); onViewChange(entry.id); }}
        className={cn(
          "flex items-center w-full gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-accent text-foreground"
            : "text-foreground hover:bg-accent"
        )}
      >
        <Icon size={16} weight="duotone" className="shrink-0 text-muted-foreground" />
        <span className="flex-1 text-left">{entry.label}</span>
        {open
          ? <CaretDown size={13} className="text-muted-foreground shrink-0" />
          : <CaretRight size={13} className="text-muted-foreground shrink-0" />
        }
      </button>
      {open && (
        <div className="flex flex-col mt-0.5">
          {entry.children.map(child => (
            <NavLeafItem
              key={child.id}
              leaf={child}
              active={activeView === child.id}
              onSelect={() => onViewChange(child.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavSingleItem({ entry, active, onSelect }: { entry: NavItem; active: boolean; onSelect: () => void }) {
  const Icon = entry.icon;
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex items-center w-full gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
        active
          ? "bg-accent text-foreground"
          : "text-foreground hover:bg-accent"
      )}
    >
      <Icon size={16} weight="duotone" className="shrink-0 text-muted-foreground" />
      <span className="flex-1 text-left">{entry.label}</span>
    </button>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function WorkNav({ activeView, onViewChange }: WorkNavProps) {
  return (
    <nav className="flex flex-col h-full overflow-y-auto py-4 pl-2 pr-4 gap-4 w-56 shrink-0">
      {NAV.map((section, si) => (
        <div key={section.title}>
          {si > 0 && <Separator className="mb-4" />}
          <p className="px-3 mb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {section.title}
          </p>
          <div className="flex flex-col gap-0.5">
            {section.entries.map(entry =>
              entry.kind === "branch"
                ? <NavBranchItem key={entry.id} entry={entry} activeView={activeView} onViewChange={onViewChange} />
                : <NavSingleItem key={entry.id} entry={entry as NavItem} active={activeView === entry.id} onSelect={() => onViewChange(entry.id)} />
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}
