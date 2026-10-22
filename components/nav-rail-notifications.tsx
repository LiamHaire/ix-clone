"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle,
  Warning,
  Info,
  CalendarCheck,
  ClipboardText,
  UserCircle,
  Files,
} from "@phosphor-icons/react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    icon: Warning,
    iconColor: "text-warning",
    title: "File review overdue",
    description: "Whitmore conveyancing matter is 3 days past its scheduled file review date.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    icon: ClipboardText,
    iconColor: "text-info",
    title: "Task assigned to you",
    description: "Arthur Pendleton assigned you a conflict check task on the Hendricks case.",
    time: "14m ago",
    unread: true,
  },
  {
    id: "3",
    icon: CalendarCheck,
    iconColor: "text-success",
    title: "Appointment confirmed",
    description: "Dr Sarah Okafor's appointment on 15 Oct at 09:30 has been confirmed.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "4",
    icon: UserCircle,
    iconColor: "text-muted-foreground",
    title: "Patient record updated",
    description: "Margaret Ellison's contact details were updated by reception.",
    time: "2h ago",
    unread: false,
  },
  {
    id: "5",
    icon: Files,
    iconColor: "text-muted-foreground",
    title: "Document ready for review",
    description: "Draft settlement agreement v4 for the Hendricks case is ready.",
    time: "3h ago",
    unread: false,
  },
  {
    id: "6",
    icon: CheckCircle,
    iconColor: "text-success",
    title: "Medication review saved",
    description: "Medication review for Margaret Ellison was saved successfully.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "7",
    icon: Info,
    iconColor: "text-info",
    title: "System update scheduled",
    description: "IQ will be unavailable for maintenance on Sunday 19 Oct, 02:00–04:00.",
    time: "Yesterday",
    unread: false,
  },
];

type Tab = "all" | "unread";

export function NotificationsPopover({ hideBadge }: { hideBadge?: boolean } = {}) {
  const [tab, setTab] = useState<Tab>("all");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter(n => n.unread).length;
  const visible = tab === "unread" ? notifications.filter(n => n.unread) : notifications;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  }

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              className={cn(
                "relative flex items-center justify-center rounded-full transition-colors",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              )}
              aria-label="Notifications"
              style={{ width: 36, height: 36 }}
            />
          }
        >
          <Bell size={20} weight="duotone" />
          {unreadCount > 0 && !hideBadge && (
            <span className="pointer-events-none absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold leading-none px-1">
              {unreadCount}
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent side="right">Notifications</TooltipContent>
      </Tooltip>

      <PopoverContent side="right" align="end" sideOffset={10} className="w-[380px] p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 pb-2">
          {(["all", "unread"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize",
                tab === t
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {t === "unread" ? `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` : "All"}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="flex flex-col overflow-y-auto max-h-[420px] [scrollbar-gutter:stable] pb-2">
          {visible.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-muted-foreground">No unread notifications</p>
            </div>
          ) : (
            visible.map(n => {
              const Icon = n.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
                    n.unread && "bg-accent/40"
                  )}
                >
                  <div className="mt-0.5 shrink-0 flex items-center justify-center size-8 rounded-full bg-muted">
                    <Icon size={16} weight="duotone" className={n.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-[13px] leading-snug", n.unread ? "font-semibold text-foreground" : "font-medium text-foreground")}>
                        {n.title}
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0 mt-px">{n.time}</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">
                      {n.description}
                    </p>
                  </div>
                  {n.unread && (
                    <div className="mt-2 size-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
