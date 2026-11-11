"use client";

import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { SheetHeader } from "@/components/ui/sheet";
import { Deploy } from "@/components/ui/iqons";
import { ReleaseNotesNav } from "./release-notes-nav";
import { ReleaseEntryCard } from "./release-entry";
import { RELEASE_CATEGORIES, RELEASE_ENTRIES } from "./release-notes-data";
import { ReleaseNotesHighlights } from "./release-notes-highlights";

interface ReleaseNotesPanelProps {
  onClose: () => void;
  expanded?: boolean;
}

export function ReleaseNotesPanel({ onClose, expanded }: ReleaseNotesPanelProps) {
  const [activeView, setActiveView] = useState<string>("all");
  const active = RELEASE_CATEGORIES.find(c => c.id === activeView) ?? RELEASE_CATEGORIES[0];
  const entries = activeView === "all" ? RELEASE_ENTRIES : RELEASE_ENTRIES.filter(e => e.category === activeView);

  return (
    <div className="h-full flex flex-col bg-background">
      <SheetHeader className="px-4 pt-4 pb-3 flex-row items-center justify-between gap-2 shrink-0 border-b border-border">
        <div className="flex items-center gap-2">
          <Deploy variant="duotone" size={16} className="text-muted-foreground shrink-0" />
          <p className="font-heading text-base font-medium text-foreground leading-none">Release notes</p>
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
        <div
          className={`flex flex-1 min-h-0 overflow-hidden mx-auto w-full ${expanded ? "max-w-[1600px]" : "max-w-[1200px]"}`}
          style={{ transition: "max-width var(--dur-panel-resize) var(--ease-out-expo)" }}
        >
          <ReleaseNotesNav activeView={activeView} onViewChange={setActiveView} />

          <div className="w-px bg-border my-4 shrink-0" />

          <div className="flex-1 min-w-0 overflow-y-auto [scrollbar-gutter:stable] pl-6 pr-4 py-6">
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="font-heading text-2xl font-semibold text-foreground leading-tight -mt-[3px]">
                  {activeView === "all" ? "Release notes" : active.label}
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activeView === "all"
                    ? "See what's new, improved and fixed in IQ."
                    : `Release notes filtered by ${active.label.toLowerCase()}.`}
                </p>
              </div>

              {entries.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 px-5 py-10 text-center">
                  <p className="text-sm text-muted-foreground">No release notes in this category yet</p>
                </div>
              ) : (
                entries.map(entry => <ReleaseEntryCard key={entry.id} entry={entry} />)
              )}
            </div>
          </div>

          <ReleaseNotesHighlights />
        </div>
      </div>
    </div>
  );
}
