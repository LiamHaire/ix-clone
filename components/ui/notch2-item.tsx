import * as React from "react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Clipboard } from "@/components/ui/iqons/Clipboard"
import { IconPriorityHigh } from "@/components/ui/iqons/IconPriorityHigh"
import { IconPriorityMedium } from "@/components/ui/iqons/IconPriorityMedium"
import { IconPriorityLow } from "@/components/ui/iqons/IconPriorityLow"

export type Notch2ItemPriority = "high" | "medium" | "low"

// Mineral tones built from the file-type tokens: solid and deepened in light mode, soft tint in dark mode.
const AVATAR_TONES = [
  "bg-[color-mix(in_oklch,var(--file-pdf),black_35%)] dark:bg-file-pdf/15 dark:text-file-pdf", // garnet
  "bg-[color-mix(in_oklch,var(--file-document),black_35%)] dark:bg-file-document/15 dark:text-file-document", // lapis
  "bg-[color-mix(in_oklch,var(--file-video),black_35%)] dark:bg-file-video/15 dark:text-file-video", // malachite
  "bg-[color-mix(in_oklch,var(--file-audio),black_35%)] dark:bg-file-audio/15 dark:text-file-audio", // amethyst
  "bg-[color-mix(in_oklch,var(--file-email),black_35%)] dark:bg-file-email/15 dark:text-file-email", // turquoise
  "bg-[color-mix(in_oklch,var(--file-slide),black_35%)] dark:bg-file-slide/15 dark:text-file-slide", // carnelian
  "bg-[color-mix(in_oklch,var(--file-image),black_35%)] dark:bg-file-image/15 dark:text-file-image", // rhodonite
  "bg-[color-mix(in_oklch,var(--file-archive),black_35%)] dark:bg-file-archive/15 dark:text-file-archive", // tiger's eye
  "bg-[color-mix(in_oklch,var(--file-code),black_35%)] dark:bg-file-code/15 dark:text-file-code", // sodalite
]

export function avatarTone(initials: string, index?: number) {
  const i = index ?? [...initials].reduce((a, c) => a + c.charCodeAt(0), 0)
  return AVATAR_TONES[i % AVATAR_TONES.length]
}

export interface Notch2ItemProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  /** Square bordered icon slot on the left. */
  icon?: React.ReactNode
  /** Avatar initials slot on the left. */
  initials?: string
  /** Picks the avatar colour. Lists pass the row index so neighbours never match. */
  avatarIndex?: number
  title: React.ReactNode
  /** Primary-colour second line. */
  subtitle?: React.ReactNode
  /** Secondary-colour clamped paragraph. */
  body?: React.ReactNode
  /** Trailing text in the title row, e.g. "Today". */
  time?: string
  badge?: string
  badgeVariant?: React.ComponentProps<typeof Badge>["variant"]
  priority?: Notch2ItemPriority
  /** Shows an unread dot before the title. */
  isNew?: boolean
}

function PriorityIcon({ priority }: { priority: Notch2ItemPriority }) {
  if (priority === "high")
    return <IconPriorityHigh size={20} className="shrink-0 text-destructive" label="High priority" />
  if (priority === "medium")
    return <IconPriorityMedium size={20} className="shrink-0 text-warning" label="Medium priority" />
  return <IconPriorityLow size={20} className="shrink-0 text-muted-foreground" label="Low priority" />
}

export function Notch2ItemIcon({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-[4px] border border-border text-foreground">
      {children ?? <Clipboard size={24} />}
    </div>
  )
}

function Notch2Item({
  icon,
  initials,
  avatarIndex,
  title,
  subtitle,
  body,
  time,
  badge,
  badgeVariant,
  priority,
  isNew = false,
  className,
  onClick,
  ...props
}: Notch2ItemProps) {
  const clickable = Boolean(onClick)

  return (
    <div
      data-slot="notch2-item"
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.target !== e.currentTarget) return
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                e.currentTarget.click()
              }
            }
          : undefined
      }
      className={cn(
        "flex items-start gap-3 p-2 text-left",
        clickable && "cursor-pointer hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {icon}
      {initials && (
        <div
          aria-hidden
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-base font-semibold text-primary-foreground",
            avatarTone(initials, avatarIndex)
          )}
        >
          {initials}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex h-5 items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{title}</p>
          {priority && <PriorityIcon priority={priority} />}
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
          {time && <span className="shrink-0 pt-px text-xs whitespace-nowrap text-muted-foreground">{time}</span>}
          {isNew && (
            <>
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-chart-1" />
              <span className="sr-only">New</span>
            </>
          )}
        </div>
        {subtitle && <p className="truncate text-sm font-normal text-muted-foreground">{subtitle}</p>}
        {body && <p className="line-clamp-2 text-sm text-muted-foreground">{body}</p>}
      </div>
    </div>
  )
}

function Notch2TileHeader({ icon: Icon, title, meta, accentColor }: {
  icon: React.ElementType
  title: string
  meta: string
  accentColor?: string
}) {
  return (
    <header className="flex h-5 items-center gap-2">
      <Icon size={16} className={cn("shrink-0", !accentColor && "text-foreground")} style={accentColor ? { color: accentColor } : undefined} />
      <h3 className="min-w-0 flex-1 truncate text-sm font-medium" style={accentColor ? { color: accentColor } : undefined}>{title}</h3>
      <span className="shrink-0 text-xs text-muted-foreground">{meta}</span>
    </header>
  )
}

function Notch2ItemList({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children)
  return (
    <div className="flex flex-col">
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div aria-hidden className="h-px shrink-0 rounded-[1px] bg-border" />}
          {child}
        </React.Fragment>
      ))}
    </div>
  )
}

export { Notch2Item, Notch2ItemList, Notch2TileHeader }
