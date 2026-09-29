'use client';

import { useState } from 'react';
import { X, DotsThreeVertical, ArrowRight, CaretRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { SheetHeader } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ACTIVE_PATIENT } from '@/lib/patientData';
import { PatientBanner } from '@/components/chat/patient-banner';
import { SummaryCardContent } from '@/components/chat/summary-card-content';
import { EncountersCardContent } from '@/components/chat/encounters-card-content';
import { MedicationsCardContent } from '@/components/chat/medications-card-content';
import { MedicationsDetailView } from '@/components/chat/medications-detail-view';
import { TestsCardContent } from '@/components/chat/tests-card-content';

type PanelView = 'summary' | 'medications';

interface PatientSummaryPanelProps {
  onClose: () => void;
  onTasksClick?: () => void;
}

export function PatientSummaryPanel({ onClose, onTasksClick }: PatientSummaryPanelProps) {
  const patient = ACTIVE_PATIENT;
  const { demographics } = patient;
  const [view, setView] = useState<PanelView>('summary');

  const VIEW_LABELS: Record<PanelView, string> = {
    summary:     'OneView',
    medications: 'Medications',
  };

  return (
    <div className="h-full flex flex-col border-l border-border bg-popover">

      {/* Header */}
      <SheetHeader className="px-5 pt-5 pb-4 flex-row items-start justify-between gap-2 shrink-0">
        <div className="flex flex-col gap-0.5">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setView('summary')}
              className={`font-heading text-base font-medium leading-none transition-colors ${view === 'summary' ? 'text-foreground pointer-events-none' : 'text-muted-foreground hover:text-foreground'}`}
            >
              OneView
            </button>
            {view !== 'summary' && (
              <>
                <CaretRight size={12} className="text-muted-foreground shrink-0" />
                <span className="font-heading text-base font-medium text-foreground leading-none">
                  {VIEW_LABELS[view]}
                </span>
              </>
            )}
          </div>
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
      <div className="flex-1 min-h-0 overflow-y-auto px-5 [scrollbar-gutter:stable]">
        <div className="max-w-[1200px] mx-auto pt-4 pb-0">
        {/* Banner — always visible */}
        <PatientBanner patient={patient} onTasksClick={onTasksClick} />

        {/* Medications detail view */}
        {view === 'medications' && (
          <MedicationsDetailView patient={patient} />
        )}

        {/* Summary grid */}
        {view === 'summary' && <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">

          {/* Left column — Summary */}
          <div className="flex flex-col gap-4">
            <Card className="gap-0 py-0">
              <CardHeader className="border-b border-border !flex flex-row items-center justify-between gap-2 px-4 py-4">
                <CardTitle>Summary</CardTitle>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="size-7 rounded-full text-sidebar-foreground hover:text-foreground">
                    <ArrowRight size={16} weight="duotone" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7 rounded-full text-sidebar-foreground hover:text-foreground">
                    <DotsThreeVertical size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-8 p-4">
                <SummaryCardContent patient={patient} />
              </CardContent>
            </Card>
          </div>

          {/* Right column — Encounters, Medications, Tests */}
          <div className="flex flex-col gap-4">
            <Card className="gap-0 py-0">
              <CardHeader className="border-b border-border !flex flex-row items-center justify-between gap-2 px-4 py-4">
                <CardTitle>Recent encounters</CardTitle>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="size-7 rounded-full text-sidebar-foreground hover:text-foreground">
                    <ArrowRight size={16} weight="duotone" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7 rounded-full text-sidebar-foreground hover:text-foreground">
                    <DotsThreeVertical size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-0 p-4">
                <EncountersCardContent patient={patient} />
              </CardContent>
            </Card>

            <Card className="gap-0 py-0">
              <CardHeader className="border-b border-border !flex flex-row items-center justify-between gap-2 px-4 py-4">
                <CardTitle>Current medications</CardTitle>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="size-7 rounded-full text-sidebar-foreground hover:text-foreground" onClick={() => setView('medications')} aria-label="View all medications">
                    <ArrowRight size={16} weight="duotone" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7 rounded-full text-sidebar-foreground hover:text-foreground">
                    <DotsThreeVertical size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-0 p-4">
                <MedicationsCardContent patient={patient} />
              </CardContent>
            </Card>

            <Card className="gap-0 py-0">
              <CardHeader className="border-b border-border !flex flex-row items-center justify-between gap-2 px-4 py-4">
                <CardTitle>Recent tests</CardTitle>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="size-7 rounded-full text-sidebar-foreground hover:text-foreground">
                    <ArrowRight size={16} weight="duotone" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7 rounded-full text-sidebar-foreground hover:text-foreground">
                    <DotsThreeVertical size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-0 p-4">
                <TestsCardContent patient={patient} />
              </CardContent>
            </Card>
          </div>

        </div>}
        </div>
      </div>

    </div>
  );
}
