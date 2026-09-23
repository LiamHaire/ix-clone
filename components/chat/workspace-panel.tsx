'use client';

import { X } from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';

interface WorkspacePanelProps {
  onClose: () => void;
}

const fill = 'bg-muted rounded';

export function WorkspacePanel({ onClose }: WorkspacePanelProps) {
  return (
    <div className="h-full overflow-y-auto border-r border-border">
      <div className="px-10 pt-8 pb-16 max-w-4xl">

        {/* Close */}
        <div className="flex justify-end mb-6">
          <button
            onClick={onClose}
            aria-label="Close workspace"
            className="flex items-center justify-center size-8 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className={`h-7 w-52 ${fill} mb-2`} />
          <div className={`h-4 w-36 ${fill} mb-4`} />
          <div className="flex items-center gap-2">
            <div className={`h-6 w-20 ${fill} rounded-full`} />
            <div className={`h-6 w-24 ${fill} rounded-full`} />
            <div className={`h-6 w-16 ${fill} rounded-full`} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-8 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i}>
              <div className={`h-3 w-16 ${fill} mb-2`} />
              <div className={`h-9 w-24 ${fill}`} />
            </div>
          ))}
        </div>

        <Separator className="mb-8" />

        {/* Table */}
        <div className="mb-8">
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

        <Separator className="mb-8" />

        {/* Timeline */}
        <div>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 pb-6">
              <div className="flex flex-col items-center pt-1.5">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 flex-shrink-0" />
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
  );
}
