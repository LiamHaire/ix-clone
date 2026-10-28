'use client';

import { Badge } from '@/components/ui/badge';
import { PreviewItem, type PreviewItemProps } from '@/components/ui/preview-item';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EmailPreviewItemProps
  extends Omit<PreviewItemProps, 'icon' | 'chipSlot' | 'title'> {
  sender: string;
  subject: string;
  preview: string;
  attachments?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function EmailPreviewItem({
  sender,
  subject,
  preview,
  unread,
  attachments,
  ...rest
}: EmailPreviewItemProps) {
  const attachmentChip = attachments ? (
    <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded-full border border-border bg-transparent text-[11px] font-medium text-muted-foreground shrink-0">
      {attachments} {attachments === 1 ? 'attachment' : 'attachments'}
    </span>
  ) : undefined;

  return (
    <PreviewItem
      title={sender}
      subtitle={subject}
      description={preview}
      unread={unread}
      chipSlot={attachmentChip}
      {...rest}
    />
  );
}
