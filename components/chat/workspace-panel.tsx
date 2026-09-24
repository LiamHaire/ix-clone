'use client';

import { X, DotsThreeVertical } from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { SheetHeader } from '@/components/ui/sheet';

interface WorkspacePanelProps {
  title: string;
  onClose: () => void;
}

const fill = 'bg-muted rounded';

export function WorkspacePanel({ title, onClose }: WorkspacePanelProps) {
  return (
    <div className="h-full flex flex-col border-r border-border bg-popover">

      {/* Header — no border, matches AdditionalPanel */}
      <SheetHeader className="px-5 pt-5 pb-4 flex-row items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="font-heading text-base font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">Schedule overview · 12 entries</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Actions"
          >
            <DotsThreeVertical size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-muted-foreground hover:text-foreground"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </Button>
        </div>
      </SheetHeader>

      {/* Content in a stroked rounded container, pb-6 to match 24px base margin */}
      <div className="flex-1 min-h-0 px-5 pb-6 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-border px-4 py-5 space-y-8">

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-8">
            {[0, 1, 2, 3].map(i => (
              <div key={i}>
                <div className={`h-3 w-16 ${fill} mb-2`} />
                <div className={`h-8 w-20 ${fill}`} />
              </div>
            ))}
          </div>

          <Separator />

          {/* Table */}
          <div>
            <div className="grid grid-cols-5 gap-4 pb-3 border-b border-border">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className={`h-3 ${fill}`} />
              ))}
            </div>
            {[0, 1, 2, 3, 4, 5].map(row => (
              <div key={row} className="grid grid-cols-5 gap-4 py-4 border-b border-border items-center">
                <div className={`h-4 w-28 ${fill}`} />
                <div className={`h-4 w-20 ${fill}`} />
                <div className={`h-4 w-24 ${fill}`} />
                <div className={`h-4 w-16 ${fill}`} />
                <div className={`h-6 w-16 ${fill} rounded-full`} />
              </div>
            ))}
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 pb-6">
                <div className="flex flex-col items-center pt-1.5">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 shrink-0" />
                  {i < 3 && <div className="w-px flex-1 bg-border mt-1.5" />}
                </div>
                <div className="flex-1 pb-1">
                  <div className={`h-4 w-40 ${fill} mb-2`} />
                  <div className={`h-3 w-64 ${fill}`} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
