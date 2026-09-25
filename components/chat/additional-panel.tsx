'use client';

import { X, DotsThreeVertical } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SheetHeader, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdditionalPanelProps {
  title: string;
  onClose: () => void;
  onSend?: () => void;
  variant?: 'default' | 'draft-email';
}

const fill = 'bg-muted rounded';

export function AdditionalPanel({ title, onClose, onSend, variant = 'default' }: AdditionalPanelProps) {
  return (
    <div className="h-full flex flex-col border-l border-border bg-popover">
      <div className="flex flex-col flex-1 min-h-0 w-full max-w-[720px] mx-auto">

      {/* Header */}
      <SheetHeader className="px-5 pt-5 pb-4 flex-row items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="font-heading text-base font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">
            {variant === 'draft-email' ? 'File review corrective actions' : 'Related context'}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {variant !== 'draft-email' && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-sidebar-foreground hover:text-foreground"
              aria-label="Actions"
            >
              <DotsThreeVertical size={16} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-sidebar-foreground hover:text-foreground"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </Button>
        </div>
      </SheetHeader>

      {/* Content */}
      <div className="flex-1 min-h-0 px-5 pb-4 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-border px-4 py-5">

          {variant === 'draft-email' ? (
            <div className="flex flex-col gap-4">
              {/* Recipient */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-[13px] font-medium text-foreground">Recipient(s)</Label>
                <Input defaultValue="arthur.pendleton@work.com" className="text-[14px]" />
              </div>
              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-[13px] font-medium text-foreground">Subject</Label>
                <Input defaultValue="File Review: CON-2026-0626" className="text-[14px]" />
              </div>

              <Separator />

              {/* Body */}
              <div className="flex flex-col gap-3 text-[14px] leading-6 text-foreground">
                <p>Hi Arthur,</p>
                <p>As part of the latest file review, we identified that a conflict check needs to be completed for this matter.</p>
                <p>Please complete the conflict check and update the file with the outcome at your earliest convenience. If any potential conflict is identified, please follow the appropriate escalation process before progressing the matter further.</p>
                <p>Thanks<br />Jonathan</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className={`h-3 w-20 ${fill} mb-3`} />
                <div className={`h-3 w-full ${fill}`} />
                <div className={`h-3 w-5/6 ${fill}`} />
                <div className={`h-3 w-4/6 ${fill}`} />
              </div>
              <Separator />
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
          )}

        </div>
      </div>

      {/* Footer */}
      <SheetFooter className="px-4 pb-6 pt-0 flex-row gap-2">
        <Button variant="outline" className="flex-1 rounded-[10px]" onClick={onClose}>
          Close
        </Button>
        <Button className="flex-1 rounded-[10px] bg-[#463A2C] hover:bg-[#5a4a38] text-white" onClick={variant === 'draft-email' ? onSend : undefined}>
          {variant === 'draft-email' ? 'Send' : 'Confirm'}
        </Button>
      </SheetFooter>

      </div>
    </div>
  );
}
