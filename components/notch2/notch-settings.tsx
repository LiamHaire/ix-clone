'use client';

import { useState } from 'react';
import { SettingsNav } from '@/components/settings/settings-nav';
import { SettingsContent } from '@/components/settings/settings-content';

interface NotchSettingsViewProps {
  onClose: () => void;
}

export function NotchSettingsView({ onClose }: NotchSettingsViewProps) {
  const [activeView, setActiveView] = useState('account');

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ minHeight: 480 }}>
      {/* Two-column layout — fills remaining height, both columns scroll independently */}
      <div className="flex min-h-0" style={{ flex: '1 1 0', overflow: 'hidden', height: 0 }}>
        {/* Left nav */}
        <div className="shrink-0 border-r border-border overflow-x-hidden flex flex-col" style={{ width: 200, minWidth: 0 }}>
          <div className="flex-1 overflow-y-auto">
            <SettingsNav activeView={activeView} onViewChange={setActiveView} className="w-full" />
          </div>
          <div className="px-3 py-3 border-t border-border shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('ix:open-settings'));
              }}
              className="w-full flex items-center justify-center h-8 rounded-lg border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Go to Settings
            </button>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <SettingsContent activeView={activeView} />
        </div>
      </div>
    </div>
  );
}
