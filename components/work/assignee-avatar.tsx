"use client";

import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { ASSIGNEE_NAMES } from "./task-data";
import { cn } from "@/lib/utils";

interface AssigneeAvatarProps {
  initials: string;
  size?: "sm" | "md";
  className?: string;
}

export function AssigneeAvatar({ initials, size = "sm", className }: AssigneeAvatarProps) {
  const name = ASSIGNEE_NAMES[initials] ?? initials;
  return (
    <TooltipProvider delay={300}>
      <Tooltip>
        <TooltipTrigger
          render={
            <span
              className={cn(
                "flex items-center justify-center rounded-full bg-foreground text-background font-semibold cursor-default shrink-0",
                size === "sm" ? "size-6 text-[10px]" : "size-7 text-[11px]",
                className
              )}
            />
          }
        >
          {initials}
        </TooltipTrigger>
        <TooltipContent>{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
