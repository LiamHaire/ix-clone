"use client";

import { cn } from "@/lib/utils";
import { RELEASE_CATEGORIES } from "./release-notes-data";

interface ReleaseNotesNavProps {
  activeView: string;
  onViewChange: (id: string) => void;
}

export function ReleaseNotesNav({ activeView, onViewChange }: ReleaseNotesNavProps) {
  return (
    <nav className="flex flex-col h-full overflow-y-auto py-6 pl-2 pr-4 gap-4 w-56 shrink-0">
      <div>
        <p className="px-3 mb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Categories
        </p>
        <div className="flex flex-col gap-0.5">
          {RELEASE_CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={cn(
                "flex items-center w-full gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                activeView === id
                  ? "bg-accent text-foreground"
                  : "text-foreground hover:bg-accent"
              )}
            >
              <Icon size={16} weight="duotone" className="shrink-0 text-muted-foreground" />
              <span className="flex-1 text-left">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
