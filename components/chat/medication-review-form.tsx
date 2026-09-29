'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export interface MedicationReviewData {
  reviewCreated: string;
  reviewActioned: string;
  reviewType: string;
  patientPresence: string;
  notes: string;
  nextReview: string;
  completedBy: string;
}

interface MedicationReviewFormProps {
  onCancel?: () => void;
  onSave?: (data: MedicationReviewData) => void;
}

export function MedicationReviewForm({ onCancel, onSave }: MedicationReviewFormProps) {
  const [reviewCreated] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en-GB', { month: 'short' })}-${d.getFullYear()}`;
  });
  const [reviewActioned, setReviewActioned] = useState(() => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en-GB', { month: 'short' })}-${d.getFullYear()}`;
  });
  const [reviewType, setReviewType] = useState('Medication review');
  const [patientPresence, setPatientPresence] = useState('Patient present');
  const [notes, setNotes] = useState('');
  const [nextReview, setNextReview] = useState('3 months');
  const [completedBy, setCompletedBy] = useState('Dr. Jonathan Clarke');

  return (
    <Card className="gap-0 py-0 w-full">
      <CardHeader className="border-b border-border !flex flex-row items-center justify-between gap-2 px-4 py-4">
        <CardTitle>Medication review</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 p-4">

        {/* Two-column date row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px]">Review created</Label>
            <Input type="text" readOnly value={reviewCreated} className="bg-muted/50 text-foreground cursor-default" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px]">Review actioned</Label>
            <Input type="text" placeholder="DD-Mon-YYYY" value={reviewActioned} onChange={e => setReviewActioned(e.target.value)} />
          </div>
        </div>

        {/* Review type + Patient presence */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px]">Review type</Label>
            <Select value={reviewType} onValueChange={v => setReviewType(v ?? 'Medication review')}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Medication review">Medication review</SelectItem>
                <SelectItem value="Structured medication review">Structured medication review</SelectItem>
                <SelectItem value="Clinical medication review">Clinical medication review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px]">Patient presence</Label>
            <Select value={patientPresence} onValueChange={v => setPatientPresence(v ?? 'Patient present')}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Patient present">Patient present</SelectItem>
                <SelectItem value="Remote / telephone">Remote / telephone</SelectItem>
                <SelectItem value="Not present">Not present</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-[13px]">Notes</Label>
          <Textarea
            placeholder="Add notes here..."
            className="min-h-[96px] resize-none"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* Next review — half width */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px]">Next review</Label>
            <Select value={nextReview} onValueChange={v => setNextReview(v ?? '3 months')}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 month">1 month</SelectItem>
                <SelectItem value="3 months">3 months</SelectItem>
                <SelectItem value="6 months">6 months</SelectItem>
                <SelectItem value="12 months">12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Completed by — full width */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-[13px]">Completed by</Label>
          <Select value={completedBy} onValueChange={v => setCompletedBy(v ?? 'Dr. Jonathan Clarke')}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dr. Jonathan Clarke">Dr. Jonathan Clarke</SelectItem>
              <SelectItem value="Dr. Helen Murray">Dr. Helen Murray</SelectItem>
              <SelectItem value="Dr. Rebecca Collins">Dr. Rebecca Collins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" className="rounded-[10px] h-8 px-4 text-[13px]" onClick={onCancel}>Cancel</Button>
          <Button
            size="sm"
            className="rounded-[10px] h-8 px-4 text-[13px]"
            disabled={!notes.trim()}
            onClick={() => onSave?.({ reviewCreated, reviewActioned, reviewType, patientPresence, notes, nextReview, completedBy })}
          >
            Save review
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
