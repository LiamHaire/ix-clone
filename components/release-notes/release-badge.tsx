import { Rocket, FilmSlate, Megaphone, ThumbsUp, Bug, Hammer } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { ReleaseCategoryId } from "./release-notes-data";

const BADGES: Record<ReleaseCategoryId, { label: string; icon: React.ElementType; classes: string }> = {
  "new-feature": {
    label: "New feature",
    icon: Rocket,
    classes: "bg-pink-50 border-pink-500 text-pink-800 dark:bg-pink-950/40 dark:text-pink-300",
  },
  "coming-soon": {
    label: "Coming soon",
    icon: FilmSlate,
    classes: "bg-teal-50 border-teal-500 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300",
  },
  announcement: {
    label: "Announcement",
    icon: Megaphone,
    classes: "bg-green-50 border-green-500 text-green-800 dark:bg-green-950/40 dark:text-green-300",
  },
  improvement: {
    label: "Improvement",
    icon: ThumbsUp,
    classes: "bg-sky-50 border-sky-500 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
  },
  bug: {
    label: "Bug",
    icon: Bug,
    classes: "bg-purple-50 border-purple-500 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300",
  },
  fix: {
    label: "Fix",
    icon: Hammer,
    classes: "bg-red-50 border-red-500 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  },
};

export function ReleaseBadge({ category, className }: { category: ReleaseCategoryId; className?: string }) {
  const { label, icon: Icon, classes } = BADGES[category];
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2 py-1 text-base font-medium whitespace-nowrap", classes, className)}>
      <Icon size={18} weight="duotone" stroke="currentColor" strokeWidth={5} strokeLinejoin="round" className="shrink-0" />
      {label}
    </span>
  );
}
