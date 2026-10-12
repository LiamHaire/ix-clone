"use client";

import { useState } from "react";
import { X, ClockCounterClockwise, DotsThreeVertical, ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { SheetHeader } from "@/components/ui/sheet";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { SessionHistoryList, type IndexEntry } from "@/components/chat/session-history-list";

const SORT_OPTIONS = ["Most recent", "Oldest first", "A–Z"];

interface SessionHistoryPanelProps {
  onClose: () => void;
}

export function SessionHistoryPanel({ onClose }: SessionHistoryPanelProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Most recent");
  const [preview, setPreview] = useState<IndexEntry | null>(null);

  return (
    <div className="h-full flex flex-col border-r border-border bg-popover">

      {/* Header */}
      <SheetHeader className="px-4 pt-4 pb-3 flex-row items-center justify-between gap-2 shrink-0 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <ClockCounterClockwise size={16} weight="duotone" className="text-muted-foreground shrink-0" />
          {preview ? (
            <p className="font-heading text-base font-medium text-foreground leading-none truncate">
              Preview · <span className="text-muted-foreground font-normal">{preview.title}</span>
            </p>
          ) : (
            <p className="font-heading text-base font-medium text-foreground leading-none">Session history</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {preview ? (
            <Button
              variant="outline"
              size="default"
              className="gap-1.5"
              onClick={() => setPreview(null)}
            >
              <ArrowLeft size={14} />
              Close preview
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-sidebar-foreground hover:text-foreground"
              aria-label="More options"
            >
              <DotsThreeVertical size={16} />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-sidebar-foreground hover:text-foreground"
                aria-label="Actions"
              >
                <DotsThreeVertical size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-sidebar-foreground hover:text-foreground"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={16} />
              </Button>
            </>
          )}
        </div>
      </SheetHeader>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-6">
        {preview ? (
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <preview.icon size={18} weight="duotone" className="text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{preview.title}</p>
                <p className="text-xs text-muted-foreground">{preview.description}</p>
              </div>
            </div>
            <div className="rounded-xl border border-border min-h-[400px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Preview content for "{preview.title}" will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="max-w-[1200px] mx-auto flex flex-col rounded-xl overflow-hidden">
            <TableToolbar
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Filter by title, category…"
              onFilter={() => {}}
              sortOptions={SORT_OPTIONS}
              sortValue={sort}
              onSortChange={setSort}
              className="border-none px-0"
            />
            <SessionHistoryList search={search} onPreview={setPreview} />
          </div>
        )}
      </div>

    </div>
  );
}
