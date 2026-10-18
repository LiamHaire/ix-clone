"use client";

import { useState } from "react";
import {
  NotePencil,
  ClockCounterClockwise,
  SquaresFour,
  Info,
  Gear,
  SignOut,
  User,
  ListChecks,
  Books,
  CalendarBlank,
  ChartBar,
  Heartbeat,
  Monitor,
  Microphone,
} from "@phosphor-icons/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { NotificationsPopover } from "@/components/nav-rail-notifications";

const APPS = [
  { label: "Calendar",       icon: CalendarBlank },
  { label: "Reporting",      icon: ChartBar      },
  { label: "IQ Health",      icon: Heartbeat     },
  { label: "Admin",          icon: Monitor       },
  { label: "Scribe",         icon: Microphone    },
] as const;

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

function NavItem({ icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          "relative flex items-center justify-center rounded-full transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        aria-label={label}
        style={{ width: 36, height: 36 }}
        onClick={onClick}
      >
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="pointer-events-none absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold leading-none px-1">
            {badge}
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function NavRail({ onNewChat }: { onNewChat?: () => void }) {
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <aside
      className="shrink-0 flex flex-col items-center py-2 border-r h-full z-50"
      style={{
        width: "var(--nav-rail-width)",
        background: "var(--nav-rail-bg)",
        borderColor: "var(--nav-rail-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center w-full h-10 mb-2">
        <IQLogo />
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col items-center gap-2 px-3 pt-1">
        <NavItem icon={<NotePencil size={20} weight="duotone" />} label="New session" onClick={() => window.dispatchEvent(new CustomEvent("ix:new-chat"))} />
        <NavItem icon={<ClockCounterClockwise size={20} weight="duotone" />} label="Session history" onClick={() => window.dispatchEvent(new CustomEvent("ix:open-session-history"))} />
        <NavItem icon={<ListChecks size={20} weight="duotone" />} label="Work" onClick={() => window.dispatchEvent(new CustomEvent("ix:open-work"))} />
        <NavItem icon={<Books size={20} weight="duotone" />} label="Knowledge base" />

        {/* App switcher */}
        <DropdownMenu open={appSwitcherOpen} onOpenChange={setAppSwitcherOpen}>
          <Tooltip>
            <TooltipTrigger
              render={
                <DropdownMenuTrigger
                  aria-label="Apps"
                  className={cn(
                    "relative flex items-center justify-center rounded-full transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    appSwitcherOpen
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  style={{ width: 36, height: 36 }}
                />
              }
            >
              <SquaresFour size={20} weight="duotone" />
            </TooltipTrigger>
            <TooltipContent side="right">Apps</TooltipContent>
          </Tooltip>
          <DropdownMenuContent side="right" align="start" sideOffset={8} className="p-3 w-auto">
            <div className="grid grid-cols-3 gap-2">
              {APPS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2",
                    "w-[88px] py-3 px-2 rounded-lg",
                    "border border-border bg-background",
                    "text-muted-foreground hover:text-foreground hover:bg-accent",
                    "transition-colors cursor-pointer"
                  )}
                >
                  <Icon size={24} weight="duotone" />
                  <span className="text-xs font-medium leading-none">{label}</span>
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Bottom nav */}
      <nav className="flex flex-col items-center gap-2 px-3 mt-auto pb-2">
        <NotificationsPopover />
        <NavItem icon={<Info size={20} weight="duotone" />} label="Info" />
        <NavItem icon={<Gear size={20} weight="duotone" />} label="Settings" onClick={() => window.dispatchEvent(new CustomEvent("ix:open-settings"))} />

        {/* Avatar */}
        <DropdownMenu open={avatarOpen} onOpenChange={setAvatarOpen}>
          <DropdownMenuTrigger
            aria-label="Jonathan Smith"
            className={cn(
              "flex items-center justify-center rounded-full text-xs font-semibold mt-1",
              "border border-sidebar-border text-sidebar-accent-foreground",
              "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              avatarOpen
                ? "bg-sidebar-accent/60"
                : "bg-sidebar hover:bg-sidebar-accent"
            )}
            style={{ width: 36, height: 36 }}
          >
            JS
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" sideOffset={8} className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium text-foreground">Jonathan Smith</p>
                <p className="text-xs text-muted-foreground">j.smith@chambers.co.uk</p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2">
                <User size={15} className="text-muted-foreground" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Gear size={15} className="text-muted-foreground" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                <SignOut size={15} />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </aside>
  );
}

function IQLogo() {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 1.5H3.39V18.613H0V1.5Z" fill="url(#iq-grad)" />
      <path
        d="M22.44 15.0C21.664 14.228 20.686 13.246 19.98 12.542 19.433 11.994 19.048 11.61 19.048 11.61L16.178 8.74 13.782 11.136 16.482 13.836 17.584 14.935 20.043 17.393 21.298 18.649 23.695 16.252C23.663 16.219 23.134 15.691 22.443 15.0ZM21.357 3.564C17.842 0.049 12.122 0.049 8.607 3.564 5.092 7.079 5.092 12.799 8.607 16.314 10.364 18.071 12.673 18.949 14.982 18.949 17.291 18.949 15.784 18.923 16.182 18.871V15.447C14.372 15.838 12.402 15.329 10.997 13.927 9.93 12.861 9.347 11.445 9.347 9.942 9.347 8.439 9.934 7.024 10.997 5.958 12.096 4.859 13.54 4.308 14.982 4.308 16.423 4.308 17.867 4.859 18.966 5.958 20.032 7.024 20.616 8.436 20.616 9.942 20.616 11.449 20.574 10.754 20.489 11.142H23.913C24.271 8.452 23.42 5.631 21.357 3.57V3.564Z"
        fill="url(#iq-grad)"
      />
      <defs>
        <radialGradient id="iq-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8 3.5) scale(16)">
          <stop stopColor="#FCC54C" />
          <stop offset="0.6" stopColor="#F15D22" />
          <stop offset="1" stopColor="#E23F13" />
        </radialGradient>
      </defs>
    </svg>
  );
}
