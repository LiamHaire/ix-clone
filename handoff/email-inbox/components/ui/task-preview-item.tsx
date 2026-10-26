'use client';

import { ListChecks } from '@phosphor-icons/react';
import { IconPriorityHigh } from '@/components/ui/iqons/IconPriorityHigh';
import { IconPriorityMedium } from '@/components/ui/iqons/IconPriorityMedium';
import { IconPriorityLow } from '@/components/ui/iqons/IconPriorityLow';
import { PreviewItem, type PreviewItemProps } from '@/components/ui/preview-item';

// ── Types ─────────────────────────────────────────────────────────────────────

export type TaskPriority = 'high' | 'medium' | 'low';

export interface TaskPreviewItemProps extends Omit<PreviewItemProps, 'icon' | 'subtitle' | 'statusIcon' | 'chipSlot'> {
  priority?: TaskPriority;
}

// ── Priority config ───────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; icon: React.ReactNode; className: string }> = {
  high:   { label: 'High',   icon: <IconPriorityHigh   size={12} variant="duotone" />, className: 'bg-destructive/10 text-destructive border-destructive/20' },
  medium: { label: 'Medium', icon: <IconPriorityMedium size={12} variant="duotone" />, className: 'bg-warning/10 text-warning border-warning/20' },
  low:    { label: 'Low',    icon: <IconPriorityLow    size={12} variant="duotone" />, className: 'bg-muted text-muted-foreground border-border' },
};

// ── Component ─────────────────────────────────────────────────────────────────

export function TaskPreviewItem({ priority, ...rest }: TaskPreviewItemProps) {
  const config = priority ? PRIORITY_CONFIG[priority] : undefined;

  const priorityChip = config ? (
    <span className={`inline-flex items-center gap-1 h-5 px-1.5 rounded-full border text-[11px] font-medium shrink-0 ${config.className}`}>
      <span className="flex items-center">{config.icon}</span>
      {config.label}
    </span>
  ) : undefined;

  return (
    <PreviewItem
      icon={<ListChecks weight="duotone" className="text-muted-foreground" />}
      chipSlot={priorityChip}
      {...rest}
    />
  );
}
