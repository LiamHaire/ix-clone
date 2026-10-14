"use client";

import {
  User,
  PaintBrush,
  Sparkle,
  Info,
  ChatTeardrop,
  Wrench,
  Brain,
} from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SettingsNavProps {
  activeView: string;
  onViewChange: (id: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  gap?: boolean;
}

const GROUPS: NavGroup[] = [
  {
    title: "General",
    items: [
      { id: "account",        label: "Account",        icon: User       },
      { id: "appearance",     label: "Appearance",     icon: PaintBrush },
      { id: "personalisation",label: "Personalisation",icon: Sparkle    },
      { id: "about",          label: "About",          icon: Info       },
    ],
  },
  {
    title: "AI",
    gap: true,
    items: [
      { id: "chat",     label: "Chat",     icon: ChatTeardrop },
      { id: "skills",   label: "Skills",   icon: Wrench       },
      { id: "memories", label: "Memories", icon: Brain        },
    ],
  },
];

export function SettingsNav({ activeView, onViewChange }: SettingsNavProps) {
  return (
    <nav className="flex flex-col h-full overflow-y-auto py-4 pl-2 pr-4 gap-4 w-56 shrink-0">
      {GROUPS.map((group, gi) => (
        <div key={gi}>
          {gi > 0 && <Separator className="mb-4" />}
          <p className="px-3 mb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {group.title}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map(item => {
              const Icon = item.icon;
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "flex items-center w-full gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <Icon size={16} weight="duotone" className="shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
