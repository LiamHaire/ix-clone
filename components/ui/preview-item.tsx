'use client';

import { Badge } from '@/components/ui/badge';
import { Item, ItemDescription } from '@/components/ui/item';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PreviewItemProps {
  /** Icon element rendered on the left. Pass any Phosphor icon. */
  icon?: React.ReactNode;
  /** Primary label — sender name, notification source, etc. */
  title: string;
  /** Optional second line below the title — subject line, event name, etc. */
  subtitle?: string;
  /** Body preview text — truncated to 2 lines. */
  description?: string;
  /** Trailing timestamp or relative time string. */
  timestamp?: string;
  /** Renders an unread dot beside the title and fills/tints the icon. */
  unread?: boolean;
  /** Optional icon rendered to the left of the timestamp — status, priority, etc. */
  statusIcon?: React.ReactNode;
  /** Numeric badge shown beside the timestamp. */
  badge?: number;
  /** Optional tag chips rendered below the description. */
  tags?: string[];
  /** Optional pre-rendered chip(s) rendered before the tags row. */
  chipSlot?: React.ReactNode;
  /** Makes the item a button with hover state. */
  onClick?: () => void;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PreviewItem({
  icon,
  title,
  subtitle,
  description,
  timestamp,
  unread = false,
  statusIcon,
  badge,
  tags,
  chipSlot,
  onClick,
  className,
}: PreviewItemProps) {
  return (
    <Item
      variant="outline"
      render={onClick ? <button type="button" onClick={onClick} className="text-left w-full" /> : undefined}
      className={cn('flex-col items-stretch gap-2', onClick && 'cursor-pointer hover:bg-accent', className)}
    >
      {/* Header row: [icon + title/subtitle] [timestamp + badge] */}
      <div className="flex items-start gap-2.5 w-full">

        {/* Dot + icon (unread) or plain icon (read) */}
        {unread ? (
          <div className="flex items-center gap-1.5 self-center shrink-0">
            <span
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: 'var(--info)' }}
              aria-hidden="true"
            />
            {icon && (
              <div className="flex items-center justify-center size-9 rounded-lg bg-muted shrink-0 [&_svg]:size-icon">
                {icon}
              </div>
            )}
          </div>
        ) : icon && (
          <div className="flex items-center justify-center size-9 rounded-lg bg-muted shrink-0 self-center [&_svg]:size-icon">
            {icon}
          </div>
        )}

        {/* Title + subtitle — hug to fit, centred with icon */}
        <div className="flex flex-col min-w-0 flex-1 self-center">
          <div className="flex items-center gap-1.5 text-sm font-medium leading-snug text-foreground">
            <span className="truncate">{title}</span>
          </div>
          {subtitle && (
            <p className="text-sm leading-snug truncate text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* Timestamp + badge — top aligned */}
        {(statusIcon || timestamp || badge) && (
          <div className="flex flex-col items-end gap-1 shrink-0 self-start">
            <div className="flex items-center gap-1.5">
              {statusIcon && <span className="flex items-center [&_svg]:size-icon-sm">{statusIcon}</span>}
              {timestamp && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">{timestamp}</span>
              )}
            </div>
            {badge ? (
              <Badge variant="default" className="h-5 min-w-5 px-1.5 text-[11px]">
                {badge}
              </Badge>
            ) : null}
          </div>
        )}

      </div>

      {/* Description (optional) */}
      {description && (
        <ItemDescription
          className={cn('line-clamp-1 text-foreground', icon ? (unread ? 'pl-[60px]' : 'pl-[46px]') : undefined)}
          style={!icon && unread ? { paddingLeft: '18px' } : undefined}
        >
          {description}
        </ItemDescription>
      )}

      {/* Chips row (optional) */}
      {(chipSlot || (tags && tags.length > 0)) && (
        <div
          className={cn('flex flex-wrap gap-1', icon ? (unread ? 'pl-[60px]' : 'pl-[46px]') : undefined)}
          style={!icon && unread ? { paddingLeft: '18px' } : undefined}
        >
          {tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="h-5 text-[11px] px-1.5">
              {tag}
            </Badge>
          ))}
          {chipSlot}
        </div>
      )}
    </Item>
  );
}
