import * as React from "react"
import {
  CalendarBlank,
  ChartLine,
  Info,
  ListChecks,
  UserCircle,
  WarningCircle,
} from "@phosphor-icons/react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { IconPriorityHigh } from "@/components/ui/iqons/IconPriorityHigh"
import { IconPriorityMedium } from "@/components/ui/iqons/IconPriorityMedium"
import { IconPriorityLow } from "@/components/ui/iqons/IconPriorityLow"

export type NotchItemType =
  | "approval"
  | "activity"
  | "notification"
  | "message"
  | "event"
  | "task"
  | "patient"

export type NotchItemPriority = "high" | "medium" | "low"

export type NotchItemStatusTone = "warning" | "destructive" | "primary" | "muted"

const STATUS_TONE: Record<NotchItemStatusTone, string> = {
  warning: "bg-warning text-background",
  destructive: "bg-destructive text-background",
  primary: "bg-primary text-primary-foreground",
  muted: "bg-muted text-muted-foreground",
}

export interface NotchItemAction {
  label: string
  onClick?: () => void
}

export interface NotchItemProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  type: NotchItemType
  /** Shows the orange "new" dot before the media. */
  isNew?: boolean
  /** Adds a visible border. Used when the item appears in chat, not in the notch. */
  bordered?: boolean
  title: React.ReactNode
  description: React.ReactNode
  /** Message: initials shown in the avatar ring. */
  initials?: string
  /** Event / message: trailing text, e.g. "just now" or "in 15 mins". */
  time?: string
  /** Approval / activity: outline buttons at the end of the row. */
  actions?: NotchItemAction[]
  /** Task: reference shown in the accent colour before the title. */
  taskRef?: string
  /** Task: status chip, e.g. "Due". */
  status?: string
  /** Task: status chip colour. Defaults to warning. */
  statusTone?: NotchItemStatusTone
  /** Task: priority icon at the end of the row. */
  priority?: NotchItemPriority
}

const TYPE_ICON: Record<Exclude<NotchItemType, "message">, React.ElementType> = {
  approval: WarningCircle,
  activity: ChartLine,
  notification: Info,
  event: CalendarBlank,
  task: ListChecks,
  patient: UserCircle,
}

// Same selector as ItemMedia's built-in alignment, so tailwind-merge replaces it instead of losing on specificity
const MEDIA_CENTERED =
  "group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center"

function PriorityIcon({ priority }: { priority: NotchItemPriority }) {
  if (priority === "high")
    return <IconPriorityHigh size={24} variant="outline" className="shrink-0 text-destructive" label="High priority" />
  if (priority === "medium")
    return <IconPriorityMedium size={24} variant="outline" className="shrink-0 text-warning" label="Medium priority" />
  return <IconPriorityLow size={24} variant="outline" className="shrink-0 text-muted-foreground" label="Low priority" />
}

function NotchItem({
  type,
  isNew = false,
  bordered = false,
  title,
  description,
  initials,
  time,
  actions,
  taskRef,
  status,
  statusTone = "warning",
  priority,
  className,
  onClick,
  ...props
}: NotchItemProps) {
  const clickable = Boolean(onClick)
  const Icon = type === "message" ? null : TYPE_ICON[type]

  return (
    <Item
      variant="muted"
      size="sm"
      data-type={type}
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
        "flex-nowrap gap-2 rounded-[4px] px-3 py-2",
        bordered && "border-border",
        clickable && "cursor-pointer hover:bg-accent",
        className
      )}
      {...props}
    >
      {isNew && (
        <>
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-chart-1" />
          <span className="sr-only">New</span>
        </>
      )}

      {type === "message" ? (
        <ItemMedia
          className={cn(
            MEDIA_CENTERED,
            "size-[30px] rounded-full border-2 border-muted-foreground/60 bg-background text-[11px] font-semibold text-foreground"
          )}
        >
          {initials}
        </ItemMedia>
      ) : (
        Icon && (
          <ItemMedia
            className={cn(MEDIA_CENTERED, "rounded-[4px] border border-border p-1")}
          >
            <Icon size={20} weight="regular" className="text-foreground" />
          </ItemMedia>
        )
      )}

      <ItemContent className="min-w-0 gap-0">
        <ItemTitle className="w-full min-w-0 text-sm leading-5">
          <span className="block min-w-0 truncate">
            {taskRef && <span className="text-chart-1">{taskRef} - </span>}
            {title}
          </span>
        </ItemTitle>
        <ItemDescription className="line-clamp-1 leading-5">
          {description}
        </ItemDescription>
      </ItemContent>

      {actions && actions.length > 0 && (
        <ItemActions className="shrink-0 pl-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              type="button"
              variant="outline"
              size="xs"
              onClick={(e) => {
                e.stopPropagation()
                action.onClick?.()
              }}
            >
              {action.label}
            </Button>
          ))}
        </ItemActions>
      )}

      {time && (
        <span className="shrink-0 self-start pt-0.5 text-xs whitespace-nowrap text-muted-foreground">
          {time}
        </span>
      )}

      {status && (
        <Badge className={cn("h-6 px-2 font-semibold", STATUS_TONE[statusTone])}>
          {status}
        </Badge>
      )}

      {priority && <PriorityIcon priority={priority} />}
    </Item>
  )
}

export { NotchItem }
