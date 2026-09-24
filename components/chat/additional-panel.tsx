'use client';

import { X, DotsThreeVertical } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SheetHeader, SheetFooter } from '@/components/ui/sheet';

interface AdditionalPanelProps {
  title: string;
  onClose: () => void;
}

const fill = 'bg-muted rounded';

export function AdditionalPanel({ title, onClose }: AdditionalPanelProps) {
  return (
    <div className="h-full flex flex-col border-l border-border bg-popover">

      {/* Header — no border */}
      <SheetHeader className="px-5 pt-5 pb-4 flex-row items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="font-heading text-base font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">Related context</p>
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

      {/* Content in a stroked rounded container, no outer border-b */}
      <div className="flex-1 min-h-0 px-5 pb-4 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-border px-4 py-5 space-y-6">

          {/* Summary block */}
          <div className="space-y-2">
            <div className={`h-3 w-20 ${fill} mb-3`} />
            <div className={`h-3 w-full ${fill}`} />
            <div className={`h-3 w-5/6 ${fill}`} />
            <div className={`h-3 w-4/6 ${fill}`} />
          </div>

          <Separator />

          {/* List */}
          <div className="space-y-3">
            <div className={`h-3 w-16 ${fill} mb-3`} />
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-1.5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className={`h-3 w-full ${fill}`} />
                  <div className={`h-3 w-3/4 ${fill}`} />
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Metadata pairs */}
          <div className="space-y-3">
            <div className={`h-3 w-20 ${fill} mb-3`} />
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center">
                <div className={`h-3 w-20 ${fill}`} />
                <div className={`h-3 w-24 ${fill}`} />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Footer — no border */}
      <SheetFooter className="px-4 pb-6 pt-0 flex-row gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Close
        </Button>
        <Button className="flex-1 bg-[#463A2C] hover:bg-[#5a4a38] text-white">
          Confirm
        </Button>
      </SheetFooter>

    </div>
  );
}
