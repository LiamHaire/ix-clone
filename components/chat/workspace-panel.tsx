'use client';

import { X, ArrowsOut, DotsThreeVertical } from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WorkspacePanelProps {
  onClose: () => void;
}

const fill = 'bg-muted rounded';

export function WorkspacePanel({ onClose }: WorkspacePanelProps) {
  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mx-auto max-w-[1200px]">
        <Card className="w-full">

          <CardHeader className="border-b border-border">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">Today's Appointments</CardTitle>
              <CardDescription>Schedule overview · 12 entries</CardDescription>
            </div>
            <CardAction className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground hover:text-foreground" onClick={onClose} aria-label="Close workspace">
                <X size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground hover:text-foreground" aria-label="Expand">
                <ArrowsOut size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground hover:text-foreground" aria-label="More options">
                <DotsThreeVertical size={16} />
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="pt-6 pb-8 space-y-8">

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

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
