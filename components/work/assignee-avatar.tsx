"use client";

import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { ASSIGNEE_NAMES } from "./task-data";
import { cn } from "@/lib/utils";

// Distinct palette — hue spread across the wheel, readable in light + dark
const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
  LH: { bg: '#3B6BDA', text: '#ffffff' },
  JS: { bg: '#16A37F', text: '#ffffff' },
  AP: { bg: '#C2410C', text: '#ffffff' },
  MK: { bg: '#7C3AED', text: '#ffffff' },
  RB: { bg: '#B45309', text: '#ffffff' },
};

function colorForInitials(initials: string) {
  if (AVATAR_COLORS[initials]) return AVATAR_COLORS[initials];
  // Deterministic fallback from char codes
  const hue = (initials.charCodeAt(0) * 37 + (initials.charCodeAt(1) ?? 0) * 13) % 360;
  return { bg: `oklch(45% 0.18 ${hue})`, text: '#ffffff' };
}

interface AssigneeAvatarProps {
  initials: string;
  size?: "sm" | "md";
  className?: string;
}

export function AssigneeAvatar({ initials, size = "sm", className }: AssigneeAvatarProps) {
  const name = ASSIGNEE_NAMES[initials] ?? initials;
  const { bg, text } = colorForInitials(initials);

  return (
    <TooltipProvider delay={300}>
      <Tooltip>
        <TooltipTrigger
          render={
            <span
              style={{ background: bg, color: text, lineHeight: 1 }}
              className={cn(
                "inline-flex items-center justify-center rounded-full font-semibold cursor-default shrink-0 select-none",
                size === "sm" ? "size-6 text-[10px] pt-px" : "size-7 text-[11px] pt-px",
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
