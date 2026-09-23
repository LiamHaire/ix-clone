'use client';

import {
  ListItemCard,
  ThreeColumnGrid,
  TwoColumnLayout,
  MediaCard,
  StatsGrid,
  TimelineList,
  CalendarGrid,
  ProfileCard,
  TableRow,
  FormCard,
} from '@/components/ui/adaptive-cards';
import type { CardLayoutType } from '@/lib/adaptive-card-selector';

interface AdaptiveCardRendererProps {
  layouts: CardLayoutType[];
  className?: string;
}

const cardComponents: Record<CardLayoutType, React.ComponentType<{ className?: string }>> = {
  'list-item':    ListItemCard,
  'three-column': ThreeColumnGrid,
  'two-column':   TwoColumnLayout,
  media:          MediaCard,
  stats:          StatsGrid,
  timeline:       TimelineList,
  calendar:       CalendarGrid,
  profile:        ProfileCard,
  table:          TableRow,
  form:           FormCard,
};

export function AdaptiveCardRenderer({ layouts, className = '' }: AdaptiveCardRendererProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {layouts.map((layout, index) => {
        const CardComponent = cardComponents[layout];
        if (!CardComponent) return null;
        return (
          <div
            key={`${layout}-${index}`}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
          >
            <CardComponent />
          </div>
        );
      })}
    </div>
  );
}
