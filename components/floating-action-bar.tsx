"use client";

import {
  NotePencil,
  ClockCounterClockwise,
  SquaresFour,
  DotsThree,
  Gear,
  SignOut,
  User,
  Wrench,
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

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

function ActionButton({ icon, label, onClick, active }: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onClick}
        aria-label={label}
        className={cn(
          "flex items-center justify-center rounded-full transition-colors size-9",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

interface FloatingActionBarProps {
  onNewChat?: () => void;
  onInfo?: () => void;
  position?: "fixed" | "absolute";
}

export function FloatingActionBar({ onNewChat, position = "absolute" }: FloatingActionBarProps) {
  return (
    <div
      className={`${position} top-[13px] right-5 z-50 flex items-center gap-0.5 px-1.5 rounded-full border border-border/60 bg-background/80 backdrop-blur-md shadow-sm`}
      style={{ height: 48 }}
    >
      <ActionButton icon={<NotePencil size={20} weight="duotone" />} label="New chat" onClick={onNewChat} />
      <ActionButton icon={<ClockCounterClockwise size={20} weight="duotone" />} label="Chat history" />
      <ActionButton icon={<SquaresFour size={20} weight="duotone" />} label="App switcher" />
      <ActionButton icon={<Wrench size={20} weight="duotone" />} label="Tools" />
      <ActionButton icon={<DotsThree size={20} weight="bold" />} label="More" />

      {/* Divider */}
      <div className="w-px h-5 bg-border/60 mx-0.5" />

      {/* Avatar with dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Jonathan Smith"
          className={cn(
            "flex items-center justify-center rounded-full text-xs font-semibold",
            "border border-sidebar-border bg-sidebar text-sidebar-accent-foreground",
            "transition-colors hover:bg-sidebar-accent size-9",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          )}
        >
          JS
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-48">
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
    </div>
  );
}
