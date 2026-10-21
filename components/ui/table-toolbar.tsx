"use client";

import { MagnifyingGlass, Funnel, ArrowsDownUp } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onFilter?: () => void;
  filterActive?: boolean;
  sortOptions?: string[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  className?: string;
}

export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Filter by title, category…",
  onFilter,
  filterActive,
  sortOptions,
  sortValue,
  onSortChange,
  className,
}: TableToolbarProps) {
  return (
    <div className={cn("flex items-center gap-2 px-4 py-2 border-b border-border", className)}>
      {/* Search */}
      <div className="relative flex-1">
        <MagnifyingGlass
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-7 h-8 border-border bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-ring"
        />
      </div>

      {/* Sort dropdown */}
      {sortOptions && onSortChange && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="default" className="gap-1.5 shrink-0" />
            }
          >
            <ArrowsDownUp size={14} />
            {sortValue ?? sortOptions[0]}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4}>
            {sortOptions.map(option => (
              <DropdownMenuItem
                key={option}
                onClick={() => onSortChange(option)}
                className="gap-2"
              >
                <CheckIcon className={cn("size-3.5", option === sortValue ? "opacity-100" : "opacity-0")} />
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Filter button */}
      {onFilter && (
        <Button
          variant="outline"
          size="default"
          onClick={onFilter}
          className={cn(
            "gap-1.5 shrink-0",
            filterActive && "border-foreground text-foreground"
          )}
        >
          <Funnel size={14} />
          Filter
        </Button>
      )}
    </div>
  );
}
