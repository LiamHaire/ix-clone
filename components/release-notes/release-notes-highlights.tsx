"use client";

import { Megaphone, Rocket, Hammer, Bug, ThumbsUp } from "@phosphor-icons/react";

interface Highlight {
  id: string;
  icon: React.ElementType;
  text: string;
}

interface HighlightSection {
  id: string;
  title: string;
  tagline: string;
  items: Highlight[];
}

const SECTIONS: HighlightSection[] = [
  {
    id: "announcements",
    title: "Announcements",
    tagline: "Keeping you in the know",
    items: [
      { id: "a1", icon: Megaphone, text: "Placeholder announcement headline" },
      { id: "a2", icon: Megaphone, text: "Another placeholder announcement" },
    ],
  },
  {
    id: "new-releases",
    title: "New releases",
    tagline: "New day. New features.",
    items: [
      { id: "n1", icon: Rocket, text: "Placeholder new feature" },
      { id: "n2", icon: Rocket, text: "Another placeholder new feature" },
    ],
  },
  {
    id: "fixes",
    title: "Fixes",
    tagline: "It was broken, now it's fixed",
    items: [
      { id: "f1", icon: Hammer,   text: "Placeholder fix" },
      { id: "f2", icon: Bug,      text: "Placeholder bug resolved" },
      { id: "f3", icon: ThumbsUp, text: "Placeholder improvement" },
    ],
  },
];

export function ReleaseNotesHighlights() {
  return (
    <aside
      aria-label="Highlights"
      className="hidden lg:flex flex-col w-64 shrink-0 overflow-y-auto border-l border-border my-4 pt-2 pl-6 pr-4 gap-8"
    >
      {SECTIONS.map(section => (
        <section key={section.id} className="flex flex-col gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground leading-tight">{section.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{section.tagline}</p>
          </div>
          <ul className="flex flex-col gap-2.5">
            {section.items.map(({ id, icon: Icon, text }) => (
              <li key={id}>
                <button className="group flex items-start gap-2.5 text-left w-full">
                  <Icon size={16} weight="duotone" className="mt-0.5 shrink-0 text-primary" />
                  <span className="text-sm leading-snug text-foreground group-hover:underline underline-offset-2">
                    {text}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}
