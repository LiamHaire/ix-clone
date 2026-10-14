"use client";

import { ListNumbers } from "@phosphor-icons/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item";
import type { IndexEntry } from "@/components/chat/session-history-list";

interface IndexPopoverProps {
  index: IndexEntry[];
  onSelect?: (entry: IndexEntry) => void;
}

export function IndexPopover({ index, onSelect }: IndexPopoverProps) {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              className="flex items-center justify-center size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
              aria-label="Index"
            />
          }
        >
          <ListNumbers size={16} />
        </TooltipTrigger>
        <TooltipContent side="bottom">Index</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-[416px] p-2">
        <div className="flex flex-col gap-0.5">
          {index.map((entry, i) => (
            <Item
              key={i}
              variant="outline"
              size="sm"
              render={
                <button
                  onClick={() => onSelect?.(entry)}
                  className="cursor-pointer hover:bg-accent transition-colors text-left w-full"
                />
              }
            >
              <ItemMedia variant="icon">
                <entry.icon size={16} weight="duotone" className="text-muted-foreground" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{entry.title}</ItemTitle>
                <ItemDescription>{entry.description}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
