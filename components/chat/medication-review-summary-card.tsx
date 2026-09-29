'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { MedicationReviewData } from './medication-review-form';

interface MedicationReviewSummaryCardProps {
  data: MedicationReviewData;
}

const ROWS: { label: string; key: keyof MedicationReviewData }[] = [
  { label: 'Review created',   key: 'reviewCreated' },
  { label: 'Review actioned',  key: 'reviewActioned' },
  { label: 'Review type',      key: 'reviewType' },
  { label: 'Patient presence', key: 'patientPresence' },
  { label: 'Next review',      key: 'nextReview' },
  { label: 'Completed by',     key: 'completedBy' },
];

export function MedicationReviewSummaryCard({ data }: MedicationReviewSummaryCardProps) {
  const hasNotes = Boolean(data.notes);
  return (
    <Card className="gap-0">
      <CardHeader className="border-b border-border">
        <CardTitle>Medication review</CardTitle>
        <CardDescription>Completed summary</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-4 pt-2">
        {ROWS.map(({ label, key }, i) => (
          <div
            key={key}
            className={`flex items-center justify-between py-3 ${i < ROWS.length - 1 || hasNotes ? 'border-b border-border' : ''}`}
          >
            <span className="text-[14px] font-medium text-foreground px-2">{label}</span>
            <span className="text-[14px] text-muted-foreground px-2">{data[key]}</span>
          </div>
        ))}
        {hasNotes && (
          <div className="flex flex-col gap-1 py-3">
            <span className="text-[14px] font-medium text-foreground px-2">Notes</span>
            <span className="text-[14px] text-muted-foreground px-2 leading-5">{data.notes}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
