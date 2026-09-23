'use client';

import { Card, CardContent } from '@/components/ui/card';

interface CardProps {
  className?: string;
}

// Shared skeleton fill — uses the warm muted token
const fill = 'bg-muted rounded';
const outline = 'border border-border rounded bg-background';

export function ListItemCard({ className = '' }: CardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`w-5 h-5 border-2 border-border rounded flex-shrink-0`} />
        <div className="flex-1 space-y-2">
          <div className={`h-4 w-32 ${fill}`} />
          <div className={`h-3 w-full ${fill}`} />
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <div className={`w-8 h-8 ${outline}`} />
          <div className={`w-8 h-8 ${outline}`} />
        </div>
      </CardContent>
    </Card>
  );
}

export function ThreeColumnGrid({ className = '' }: CardProps) {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="aspect-video bg-muted rounded-lg" />
      ))}
    </div>
  );
}

export function TwoColumnLayout({ className = '' }: CardProps) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {[0, 1].map((i) => (
        <Card key={i}>
          <CardContent className="p-6 h-40" />
        </Card>
      ))}
    </div>
  );
}

export function MediaCard({ className = '' }: CardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4 flex gap-4 items-start">
        <div className="w-14 h-14 bg-muted rounded flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className={`h-4 w-24 ${fill}`} />
          <div className={`h-3 w-40 ${fill}`} />
          <div className={`h-3 w-full ${fill}`} />
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <div className={`w-8 h-8 ${outline}`} />
          <div className={`w-8 h-8 ${outline}`} />
        </div>
      </CardContent>
      <div className="border-t border-border mx-4 mb-4">
        <div className={`mt-4 h-20 w-full ${outline}`} />
      </div>
    </Card>
  );
}

export function StatsGrid({ className = '' }: CardProps) {
  return (
    <div className={`grid grid-cols-4 gap-3 ${className}`}>
      {[0, 1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-2">
            <div className={`h-3 w-12 ${fill}`} />
            <div className={`h-8 w-16 ${fill}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TimelineList({ className = '' }: CardProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[0, 1, 2].map((i) => (
        <Card key={i}>
          <CardContent className="flex gap-3 items-center p-4">
            <div className="w-9 h-9 bg-muted rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className={`h-4 w-36 ${fill}`} />
              <div className={`h-3 w-full ${fill}`} />
            </div>
            <div className={`h-3 w-14 ${fill} flex-shrink-0`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CalendarGrid({ className = '' }: CardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="h-7 flex items-center justify-center">
              <div className={`h-3 w-3 ${fill}`} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className={`aspect-square ${outline}`} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfileCard({ className = '' }: CardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 bg-muted rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className={`h-5 w-32 ${fill}`} />
            <div className={`h-3 w-44 ${fill}`} />
          </div>
        </div>
        <div className="space-y-2">
          <div className={`h-3 w-full ${fill}`} />
          <div className={`h-3 w-5/6 ${fill}`} />
          <div className={`h-3 w-4/6 ${fill}`} />
        </div>
      </CardContent>
    </Card>
  );
}

export function TableRow({ className = '' }: CardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="grid grid-cols-5 gap-4 items-center">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-4 w-full ${fill}`} />
          ))}
          <div className="flex gap-2 justify-end">
            <div className={`w-8 h-8 ${outline}`} />
            <div className={`w-8 h-8 ${outline}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FormCard({ className = '' }: CardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <div className={`h-3 w-24 ${fill}`} />
            <div className={`h-10 w-full ${outline}`} />
          </div>
        ))}
        <div className="flex gap-3 pt-1">
          <div className={`h-9 w-24 bg-muted rounded-md`} />
          <div className={`h-9 w-24 ${outline} rounded-md`} />
        </div>
      </CardContent>
    </Card>
  );
}
