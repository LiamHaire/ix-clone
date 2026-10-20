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
        <div className="shrink-0 border-r border-border overflow-y-auto overflow-x-hidden" style={{ width: 200, minWidth: 0 }}>
          <SettingsNav activeView={activeView} onViewChange={setActiveView} className="w-full" />
        </div>

        {/* Right content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <SettingsContent activeView={activeView} />
        </div>
      </div>
    </div>
  );
}
