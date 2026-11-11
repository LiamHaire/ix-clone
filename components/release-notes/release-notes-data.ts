import { Star, Rocket, FilmSlate, Megaphone, ThumbsUp, Bug, Hammer } from "@phosphor-icons/react";

export type ReleaseCategoryId =
  | "new-feature"
  | "coming-soon"
  | "announcement"
  | "improvement"
  | "bug"
  | "fix";

export const RELEASE_CATEGORIES = [
  { id: "all",          label: "All",          icon: Star      },
  { id: "new-feature",  label: "New feature",  icon: Rocket    },
  { id: "coming-soon",  label: "Coming soon",  icon: FilmSlate },
  { id: "announcement", label: "Announcement", icon: Megaphone },
  { id: "improvement",  label: "Improvement",  icon: ThumbsUp  },
  { id: "bug",          label: "Bug",          icon: Bug       },
  { id: "fix",          label: "Fix",          icon: Hammer    },
] as const;

export interface ReleaseEntry {
  id: string;
  category: ReleaseCategoryId;
  heading: string;
  subtitle: string;
  title: string;
  body: string;
  version: string;
  hasVideo?: boolean;
  video?: { light: string; dark: string };
}

export const RELEASE_ENTRIES: ReleaseEntry[] = [
  {
    id: "r7",
    hasVideo: true,
    category: "new-feature",
    heading: "Connectors",
    subtitle: "Released 10 Nov 2026",
    title: "Introducing Connectors!",
    body: "We're bringing integrations to IQ. Connectors let you link the tools you already rely on, such as your calendar, email, document stores and clinical systems, so IQ can work with them directly. Ask a question and IQ can draw on your connected sources, or take action across them, without you switching apps or copying information between systems. You stay in control of what is connected and what IQ can access.",
    video: { light: "/videos/connectors-light.mp4", dark: "/videos/connectors-dark.mp4" },
    version: "version 4.2.0.0",
  },
  {
    id: "r6",
    category: "announcement",
    heading: "Scheduled maintenance",
    subtitle: "Posted 7 Nov 2026",
    title: "IQ will be briefly unavailable on Sunday",
    body: "We're carrying out planned maintenance on Sunday 16 November between 02:00 and 04:00. IQ will be unavailable during this window. Any work in progress is saved automatically, so you can pick up where you left off afterwards.",
    version: "version 4.1.2.0",
  },
  {
    id: "r5",
    category: "improvement",
    heading: "Session history",
    subtitle: "Released 4 Nov 2026",
    title: "Find past sessions faster",
    body: "Session history now loads noticeably quicker and groups your sessions by patient or case. Search matches titles and summaries, and sorting options remember your last choice.",
    version: "version 4.1.1.0",
  },
  {
    id: "r4",
    category: "fix",
    heading: "Work",
    subtitle: "Released 30 Oct 2026",
    title: "Task due dates now display correctly",
    body: "Fixed an issue where tasks due today could appear as overdue after midnight. Due dates now respect your local time zone across the Work list and the task board.",
    version: "version 4.1.0.2",
  },
  {
    id: "r3",
    category: "bug",
    heading: "Notifications",
    subtitle: "Reported 27 Oct 2026",
    title: "Notification count can be out of sync",
    body: "We're aware that the unread count on the bell can occasionally show a different number to the list when several notifications arrive at once. Refreshing the page clears it. A fix is being prepared.",
    version: "version 4.1.0.1",
  },
  {
    id: "r2",
    hasVideo: true,
    category: "coming-soon",
    heading: "Calendar",
    subtitle: "Planned for December 2026",
    title: "A first look at the new Calendar app",
    body: "Calendar is on its way to the app switcher. View appointments alongside your tasks, drag to reschedule, and ask IQ to find a free slot. Here's a preview of what we're building.",
    version: "version 4.3.0.0",
  },
  {
    id: "r1",
    hasVideo: true,
    category: "new-feature",
    heading: "Chat",
    subtitle: "Released 20 Oct 2026",
    title: "Collapse the chat to focus on your work",
    body: "When a workspace is open you can now collapse the chat to a slim strip and give your content the full width. Expand it again at any time from the strip.",
    version: "version 4.1.0.0",
  },
];
