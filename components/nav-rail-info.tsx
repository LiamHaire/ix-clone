"use client";

import { useState } from "react";
import { Info } from "@phosphor-icons/react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Deploy, Help } from "@/components/ui/iqons";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: "release-notes", label: "Release notes", icon: Deploy },
  { id: "help", label: "Help & info", icon: Help },
] as const;

export function InfoPopover() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              className={cn(
                "relative flex items-center justify-center rounded-full transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                open
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              aria-label="Info"
              style={{ width: 36, height: 36 }}
            />
          }
        >
          <Info size={20} weight="duotone" />
        </TooltipTrigger>
        <TooltipContent side="right">Info</TooltipContent>
      </Tooltip>

      <PopoverContent side="right" align="end" sideOffset={10} className="w-[200px] p-1.5">
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setOpen(false);
              if (id === "release-notes") window.dispatchEvent(new CustomEvent("ix:open-release-notes"));
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Icon variant="duotone" size={18} className="text-muted-foreground" />
            {label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
