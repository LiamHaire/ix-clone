'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { Patient } from '@/lib/patientData';

type Encounter = Patient['encounters'][number];

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-[14px] text-muted-foreground w-28 shrink-0">{label}</span>
      <span className="text-[14px] text-foreground">{value}</span>
    </div>
  );
}

function ExpandedSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
      {children}
    </div>
  );
}

function EncounterTile({ encounter, index }: { encounter: Encounter; index: number }) {
  const hasDiagnosis   = encounter.diagnosis && encounter.diagnosis.length > 0;
  const hasObservations = encounter.observations && Object.keys(encounter.observations).length > 0;

  return (
    <AccordionItem
      value={`encounter-${index}`}
      className="border border-border rounded-lg overflow-hidden mb-2 last:mb-0 not-last:border-b"
    >
      <AccordionTrigger className="px-3 hover:no-underline items-center gap-2">
        <span className="flex-1 text-[14px] font-medium text-foreground text-left">
          {encounter.type}
        </span>
        <span className="text-[12px] text-muted-foreground mr-2 whitespace-nowrap shrink-0">
          {encounter.date}
        </span>
      </AccordionTrigger>
      <AccordionContent className="border-t border-border">
        <div className="flex flex-col gap-5 p-4">

          <ExpandedSection title="Clinician & location">
            <DetailRow label="Clinician" value={encounter.clinician} />
            {encounter.location && <DetailRow label="Location" value={encounter.location} />}
            <DetailRow label="Time" value={encounter.time} />
          </ExpandedSection>

          {encounter.presentingComplaint && (
            <ExpandedSection title="Presenting complaint">
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                {encounter.presentingComplaint}
              </p>
            </ExpandedSection>
          )}

          <ExpandedSection title="Notes">
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {encounter.summaryNotes}
            </p>
          </ExpandedSection>

          {hasObservations && (
            <ExpandedSection title="Observations">
              {Object.entries(encounter.observations!).map(([k, v]) => (
                <DetailRow key={k} label={k} value={String(v)} />
              ))}
            </ExpandedSection>
          )}

          {hasDiagnosis && (
            <ExpandedSection title="Diagnosis">
              {encounter.diagnosis!.map((d, i) => (
                <p key={i} className="text-[14px] text-muted-foreground">{d}</p>
              ))}
            </ExpandedSection>
          )}

        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function EncountersCardContent({ patient }: { patient: Patient }) {
  const encounters = [...patient.encounters].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (encounters.length === 0) {
    return <p className="text-[14px] text-muted-foreground">No recent encounters recorded.</p>;
  }

  return (
    <Accordion multiple>
      {encounters.map((enc, i) => (
        <EncounterTile key={`${enc.date}-${enc.type}`} encounter={enc} index={i} />
      ))}
    </Accordion>
  );
}
