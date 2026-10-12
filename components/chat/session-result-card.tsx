"use client";

import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item";
import type { Session } from "@/components/chat/session-history-list";

interface SessionResultCardProps {
  session: Session;
}

export function SessionResultCard({ session }: SessionResultCardProps) {
  return (
    <div className="flex flex-col gap-4">

      {/* Summary */}
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Summary</p>
        <p className="text-sm text-foreground leading-relaxed mt-2">{session.summary}</p>
      </div>

      {/* Index */}
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Index</p>
        <div className="flex flex-col gap-1 mt-2">
          {session.index.map((entry, i) => (
            <Item key={i} variant="outline" size="sm">
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
      </div>

    </div>
  );
}
