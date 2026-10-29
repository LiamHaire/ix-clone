"use client";

import { useState } from "react";
import { X, Gear } from "@phosphor-icons/react";
import { SheetHeader } from "@/components/ui/sheet";
import { SettingsNav } from "./settings-nav";
import { SettingsContent } from "./settings-content";

interface SettingsPanelProps {
  onClose: () => void;
  expanded?: boolean;
}

export function SettingsPanel({ onClose, expanded }: SettingsPanelProps) {
  const [activeView, setActiveView] = useState("account");

  return (
    <div className="h-full flex flex-col bg-background">
      <SheetHeader className="px-4 pt-4 pb-3 flex-row items-center justify-between gap-2 shrink-0 border-b border-border">
        <div className="flex items-center gap-2">
          <Gear size={16} weight="duotone" className="text-muted-foreground shrink-0" />
          <p className="font-heading text-base font-medium text-foreground leading-none">Settings</p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center size-8 rounded-full text-sidebar-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </SheetHeader>

      <div className="flex flex-1 min-h-0 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]">
        <div className={`flex min-h-full mx-auto w-full ${expanded ? 'max-w-[1600px]' : 'max-w-[1200px]'}`} style={{ transition: 'max-width var(--dur-panel-resize) var(--ease-out-expo)' }}>
          <SettingsNav activeView={activeView} onViewChange={setActiveView} />
          <div className="w-px bg-border my-4 shrink-0" />
          <div className="flex-1 min-w-0 pl-6 pr-4 py-4">
            <SettingsContent activeView={activeView} />
          </div>
        </div>
      </div>
    </div>
  );
}
