'use client';

import { X, DotsThreeVertical, ArrowRight, CaretDown, CaretUp, CaretDoubleUp } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { SheetHeader } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ACTIVE_PATIENT } from '@/lib/patientData';
import { PatientBanner } from '@/components/chat/patient-banner';

type Level = 'Low' | 'Moderate' | 'High';

const LEVEL_STYLES: Record<Level, { chip: string; icon: string }> = {
  Low:      { chip: 'border-success/40 bg-success/8 text-success',        icon: 'text-success' },
  Moderate: { chip: 'border-warning/40 bg-warning/8 text-warning',        icon: 'text-warning' },
  High:     { chip: 'border-destructive/40 bg-destructive/8 text-destructive', icon: 'text-destructive' },
};

function ComplexityChip({ level, label }: { level: Level; label: string }) {
  const { chip, icon } = LEVEL_STYLES[level];
  const Icon = level === 'Low' ? CaretDown : level === 'High' ? CaretDoubleUp : CaretUp;
  return (
    <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
      <span className="font-medium">{label}:</span>
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] font-medium ${chip}`}>
        <Icon size={12} weight="duotone" className={icon} />
        {level}
      </span>
    </span>
  );
}

interface PatientSummaryPanelProps {
  onClose: () => void;
}

export function PatientSummaryPanel({ onClose }: PatientSummaryPanelProps) {
  const patient = ACTIVE_PATIENT;
  const { demographics, aiSummary } = patient;

  return (
    <div className="h-full flex flex-col border-r border-border bg-popover">

      {/* Header */}
      <SheetHeader className="px-5 pt-5 pb-4 flex-row items-start justify-between gap-2 shrink-0">
        <div className="flex flex-col gap-0.5">
          <p className="font-heading text-base font-medium text-foreground">OneView</p>
          <p className="text-sm text-muted-foreground">{demographics.displayName}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="size-8 rounded-full text-sidebar-foreground hover:text-foreground" aria-label="Actions">
            <DotsThreeVertical size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 rounded-full text-sidebar-foreground hover:text-foreground" onClick={onClose} aria-label="Close">
            <X size={16} />
          </Button>
        </div>
      </SheetHeader>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-6">
        <div className="max-w-[1200px] mx-auto">
        {/* Banner — full width, above columns */}
        <PatientBanner patient={patient} />

        <div className="columns-1 xl:columns-2 gap-4 space-y-4 xl:space-y-0">

          {/* AI Summary card */}
          <Card className="break-inside-avoid mb-4 gap-0">
            <CardHeader className="border-b border-border !flex flex-row items-center justify-between gap-2">
              <CardTitle>AI summary</CardTitle>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="size-7 rounded-full text-sidebar-foreground hover:text-foreground">
                  <ArrowRight size={16} weight="duotone" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7 rounded-full text-sidebar-foreground hover:text-foreground">
                  <DotsThreeVertical size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 px-4 pt-4 pb-6">
              {/* Complexity + Risk chips */}
              <div className="flex items-center gap-3 flex-wrap">
                <ComplexityChip level={aiSummary.complexity} label="Complexity" />
                <ComplexityChip level={aiSummary.risk} label="Risk" />
              </div>
              {/* Sections */}
              {aiSummary.sections.map((section) => (
                <div key={section.heading} className="flex flex-col gap-2">
                  <p className="text-[13px] font-semibold text-foreground">{section.heading}</p>
                  <ul className="flex flex-col gap-1.5">
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-2 text-[13px] text-muted-foreground leading-[1.5]">
                        <span className="mt-[5px] size-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
        </div>
      </div>

    </div>
  );
}
