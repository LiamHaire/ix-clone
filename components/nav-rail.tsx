"use client";

import {
  NotePencil,
  ChatsTeardrop,
  CalendarCheck,
  Books,
  Info,
  Gear,
} from "@phosphor-icons/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

function NavItem({ icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          "relative flex items-center justify-center rounded-lg transition-colors",
          active
            ? "bg-[#E9E4DB] text-[#1C160F]"
            : "text-[#776B5A] hover:bg-[#E9E4DB] hover:text-[#1C160F]"
        )}
        aria-label={label}
        style={{ width: 36, height: 36 }}
        onClick={onClick}
      >
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-semibold leading-none">
            {badge}
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function NavRail({ onNewChat }: { onNewChat?: () => void }) {
  return (
    <aside
      className="fixed inset-y-0 left-0 z-50 flex flex-col items-center py-2 border-r"
      style={{
        width: "var(--nav-rail-width)",
        background: "var(--nav-rail-bg)",
        borderColor: "var(--nav-rail-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center w-full h-10 mb-2">
        <IQLogo />
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col items-center gap-2 px-3 pt-1">
        <NavItem icon={<NotePencil size={20} />} label="New chat" active onClick={onNewChat} />
        <NavItem icon={<ChatsTeardrop size={20} />} label="Chats" />
        <NavItem icon={<CalendarCheck size={20} />} label="Tasks" />
        <NavItem icon={<Books size={20} />} label="Knowledge" />
      </nav>

      {/* Bottom nav */}
      <nav className="flex flex-col items-center gap-2 px-3 mt-auto pb-2">
        <NavItem icon={<Info size={20} />} label="About" />
<NavItem icon={<Gear size={20} />} label="Settings" />
        {/* Avatar */}
        <Tooltip>
          <TooltipTrigger
            className="flex items-center justify-center rounded-full bg-[#F5F0EB] border border-[#E9E4DB] text-[#1C160F] text-xs font-semibold hover:bg-[#E9E4DB] transition-colors mt-1"
            aria-label="Profile"
            style={{ width: 36, height: 36 }}
          >
            JS
          </TooltipTrigger>
          <TooltipContent side="right">Jonathan Smith</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function IQLogo() {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 1.5H3.39V18.613H0V1.5Z" fill="url(#iq-grad)" />
      <path
        d="M22.44 15.0C21.664 14.228 20.686 13.246 19.98 12.542 19.433 11.994 19.048 11.61 19.048 11.61L16.178 8.74 13.782 11.136 16.482 13.836 17.584 14.935 20.043 17.393 21.298 18.649 23.695 16.252C23.663 16.219 23.134 15.691 22.443 15.0ZM21.357 3.564C17.842 0.049 12.122 0.049 8.607 3.564 5.092 7.079 5.092 12.799 8.607 16.314 10.364 18.071 12.673 18.949 14.982 18.949 17.291 18.949 15.784 18.923 16.182 18.871V15.447C14.372 15.838 12.402 15.329 10.997 13.927 9.93 12.861 9.347 11.445 9.347 9.942 9.347 8.439 9.934 7.024 10.997 5.958 12.096 4.859 13.54 4.308 14.982 4.308 16.423 4.308 17.867 4.859 18.966 5.958 20.032 7.024 20.616 8.436 20.616 9.942 20.616 11.449 20.574 10.754 20.489 11.142H23.913C24.271 8.452 23.42 5.631 21.357 3.57V3.564Z"
        fill="url(#iq-grad)"
      />
      <defs>
        <radialGradient id="iq-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8 3.5) scale(16)">
          <stop stopColor="#FCC54C" />
          <stop offset="0.6" stopColor="#F15D22" />
          <stop offset="1" stopColor="#E23F13" />
        </radialGradient>
      </defs>
    </svg>
  );
}
