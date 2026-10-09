'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { Patient } from '@/lib/patientData';

type Medication = Patient['currentMedications'][number];

const PRESCRIPTION_TYPE_STYLES: Record<string, string> = {
  Repeat: 'border-primary/40 bg-primary/8 text-primary',
  Acute:  'border-warning/40 bg-warning/8 text-warning',
};

function PrescriptionBadge({ type }: { type: string }) {
  const cls = PRESCRIPTION_TYPE_STYLES[type] ?? 'border-border bg-muted text-muted-foreground';
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${cls}`}>
      {type}
    </span>
  );
}

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

function MedicationTile({ medication, index }: { medication: Medication; index: number }) {
  const subtitle = [medication.strength, medication.drugForm].filter(Boolean).join(' · ');

  return (
    <AccordionItem
      value={`medication-${index}`}
      className="border border-border rounded-lg overflow-hidden mb-2 last:mb-0 not-last:border-b"
    >
      <AccordionTrigger className="px-3 hover:no-underline items-center gap-2">
        <span className="flex-1 text-left min-w-0">
          <span className="block text-[14px] font-medium text-foreground">{medication.name}</span>
          {subtitle && (
            <span className="block text-[13px] text-muted-foreground">{subtitle}</span>
          )}
        </span>
        <div className="flex items-center gap-1.5 mr-2 shrink-0">
          <span className="text-[12px] text-muted-foreground whitespace-nowrap">
            {medication.prescribedDate}
          </span>
          {medication.prescriptionType && (
            <PrescriptionBadge type={medication.prescriptionType} />
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="border-t border-border">
        <div className="flex flex-col gap-5 p-4">

          <ExpandedSection title="Dosage & frequency">
            <DetailRow label="Dose"      value={medication.dose} />
            <DetailRow label="Frequency" value={medication.frequency} />
          </ExpandedSection>

          <ExpandedSection title="Details">
            <DetailRow label="Prescriber"  value={medication.prescriber} />
            <DetailRow label="Prescribed"  value={medication.prescribedDate} />
            {medication.prescriptionType && (
              <DetailRow label="Type" value={medication.prescriptionType} />
            )}
            {medication.drugForm && (
              <DetailRow label="Drug form" value={medication.drugForm} />
            )}
            {medication.strength && (
              <DetailRow label="Strength" value={medication.strength} />
            )}
          </ExpandedSection>

        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function MedicationsCardContent({ patient }: { patient: Patient }) {
  const medications = patient.currentMedications;

  if (medications.length === 0) {
    return <p className="text-[14px] text-muted-foreground">No current medications recorded.</p>;
  }

  return (
    <Accordion multiple>
      {medications.map((med, i) => (
        <MedicationTile key={`${med.name}-${i}`} medication={med} index={i} />
      ))}
    </Accordion>
  );
}
