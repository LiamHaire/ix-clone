'use client';

import { Warning, ShieldCheck, ShieldSlash, DotsThreeVertical, Info, ClipboardText } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import type { Patient } from '@/lib/patientData';

interface PatientBannerProps {
  patient: Patient;
  onTasksClick?: () => void;
}

type AllergyStatus = 'known' | 'none' | 'not-recorded' | 'unavailable';

function getAllergyStatus(text: string): AllergyStatus {
  const t = text.toLowerCase();
  if (t.includes('unavailable') || t.includes('unknown')) return 'unavailable';
  if (t.includes('not recorded') || t.includes('no record')) return 'not-recorded';
  if (t.includes('no known')) return 'none';
  return 'known';
}

const ALLERGY_LABELS: Record<AllergyStatus, string> = {
  known:          'Known allergies',
  none:           'No known allergies',
  'not-recorded': 'No allergies recorded',
  unavailable:    'Allergies unavailable',
};

function AllergyChip({ allergyText }: { allergyText: string }) {
  const status = getAllergyStatus(allergyText);
  const Icon = status === 'known' ? Warning : status === 'unavailable' ? ShieldSlash : ShieldCheck;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[13px] whitespace-nowrap shrink-0 text-foreground">
      <Icon size={20} weight="duotone" className="text-sidebar-foreground" />
      {ALLERGY_LABELS[status]}
    </span>
  );
}

export function PatientBanner({ patient, onTasksClick }: PatientBannerProps) {
  const { demographics, patientTracker } = patient;
  const idLabel = demographics.patientIdType === 'CHI' ? 'CHI' : demographics.patientIdType === 'NHS' ? 'NHS' : 'Patient ID';
  const outstandingTasks = patientTracker?.outstandingTasks ?? 0;
  const tasksLabel = outstandingTasks > 0 ? `${outstandingTasks} outstanding patient tasks` : 'Patient tasks';

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/50 px-4 py-3 mb-4">
      {/* Left: name + demographics */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-foreground leading-snug truncate">
          {demographics.displayName}
        </p>
        <p className="text-[13px] text-muted-foreground leading-snug mt-0.5 flex flex-wrap gap-x-2">
          <span>Born: {demographics.dateOfBirth}</span>
          <span className="opacity-50">·</span>
          <span>{idLabel}: {demographics.patientId}</span>
          <span className="opacity-50">·</span>
          <span>Sex: {demographics.sex}</span>
        </p>
      </div>

      {/* Icon buttons: Patient info + Tasks */}
      <TooltipProvider>
        <div className="flex items-center gap-1 shrink-0">
          <Tooltip>
            <TooltipTrigger className="inline-flex size-8 items-center justify-center rounded-full text-sidebar-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Patient information">
              <Info size={18} />
            </TooltipTrigger>
            <TooltipContent side="top">Patient information</TooltipContent>
          </Tooltip>
          <Tooltip>
            <div className="relative">
              <TooltipTrigger onClick={onTasksClick} className="inline-flex size-8 items-center justify-center rounded-full border border-border text-sidebar-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label={tasksLabel}>
                <ClipboardText size={18} />
              </TooltipTrigger>
              {outstandingTasks > 0 && (
                <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[#C0392B] border-2 border-background" />
              )}
            </div>
            <TooltipContent side="top">{tasksLabel}</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Allergy chip */}
      <AllergyChip allergyText={demographics.allergies} />

      {/* More actions */}
      <Button variant="ghost" size="icon" className="size-8 rounded-full text-sidebar-foreground hover:text-foreground shrink-0" aria-label="More actions">
        <DotsThreeVertical size={16} />
      </Button>
    </div>
  );
}
