'use client';

import { X, DotsThreeVertical } from '@phosphor-icons/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface AdditionalPanelProps {
  title: string;
  onClose: () => void;
}

const fill = 'bg-muted rounded';

export function AdditionalPanel({ title, onClose }: AdditionalPanelProps) {
  return (
    <div className="h-full p-4 flex flex-col border-l border-border">
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">

        <CardHeader className="border-b border-border">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
            <CardDescription>Related context</CardDescription>
          </div>
          <CardAction className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground hover:text-foreground" aria-label="Actions">
              <DotsThreeVertical size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground hover:text-foreground" onClick={onClose} aria-label="Close">
              <X size={16} />
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto pt-5 pb-6 space-y-6">

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
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-1.5 flex-shrink-0" />
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

        </CardContent>
      </Card>
    </div>
  );
}
