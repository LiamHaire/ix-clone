'use client';

import { useState } from 'react';
import { CaretRight, DotsThreeVertical } from '@phosphor-icons/react';
import type { Patient } from '@/lib/patientData';

type Medication = Patient['currentMedications'][number];

function PrescriberAvatar({ name }: { name: string }) {
  const initials = name
    .replace(/^Dr\s+/i, '')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('');
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-semibold shrink-0">
      {initials}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-[13px] text-muted-foreground w-36 shrink-0">{label}</span>
      <span className="text-[13px] text-foreground">{value}</span>
    </div>
  );
}

const COL = 'grid-cols-[1.5rem_minmax(0,1fr)_9rem_12rem_7rem_9rem_2rem]';

function TableHeader() {
  return (
    <div className={`grid ${COL} gap-x-4 px-4 py-2 border-b border-border`}>
      <span />
      <span className="text-[12px] font-semibold text-muted-foreground">Prescription item</span>
      <span className="text-[12px] font-semibold text-muted-foreground">Prescribed on</span>
      <span className="text-[12px] font-semibold text-muted-foreground">Prescriber</span>
      <span className="text-[12px] font-semibold text-muted-foreground">Drug form</span>
      <span className="text-[12px] font-semibold text-muted-foreground">Strength</span>
      <span />
    </div>
  );
}

function MedicationRow({ med }: { med: Medication }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      {/* Main row */}
      <div
        className={`grid ${COL} gap-x-4 items-center px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors ${expanded ? 'bg-muted/20' : ''}`}
        onClick={() => setExpanded(e => !e)}
      >
        <CaretRight
          size={14}
          className={`text-muted-foreground transition-transform duration-200 shrink-0 ${expanded ? 'rotate-90' : ''}`}
        />
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-foreground truncate">{med.name}</p>
          <p className="text-[13px] text-muted-foreground">{med.dose} · {med.frequency}</p>
        </div>
        <span className="text-[13px] text-muted-foreground whitespace-nowrap">{med.prescribedDate}</span>
        <div className="flex items-center gap-1.5">
          <PrescriberAvatar name={med.prescriber} />
          <span className="text-[13px] text-muted-foreground whitespace-nowrap">{med.prescriber.replace(/^Dr\s+/i, '')}</span>
        </div>
        <span className="text-[13px] text-muted-foreground whitespace-nowrap">{med.drugForm ?? '—'}</span>
        <span className="text-[13px] text-muted-foreground whitespace-nowrap">{med.strength ?? '—'}</span>
        <button
          className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <DotsThreeVertical size={14} />
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pt-3 pb-4 bg-muted/10 border-t border-border flex flex-col gap-2">
          {med.prescriptionContext && <DetailRow label="Prescribing context" value={med.prescriptionContext} />}
          {med.prescribedLocation  && <DetailRow label="Location"            value={med.prescribedLocation} />}
          <DetailRow label="Prescriber" value={med.prescriber} />
          {med.notes && <DetailRow label="Notes" value={med.notes} />}
        </div>
      )}
    </div>
  );
}

function MedicationGroup({ title, medications }: { title: string; medications: Medication[] }) {
  if (medications.length === 0) return null;
  return (
    <div>
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 pb-3">{title}</p>
      <div className="rounded-xl border border-border overflow-hidden">
        <TableHeader />
        {medications.map((med, i) => (
          <MedicationRow key={`${med.name}-${i}`} med={med} />
        ))}
      </div>
    </div>
  );
}

export function MedicationsDetailView({ patient }: { patient: Patient }) {
  const repeats = patient.currentMedications.filter(m => m.prescriptionType === 'Repeat');
  const acutes  = patient.currentMedications.filter(m => m.prescriptionType === 'Acute');
  const others  = patient.currentMedications.filter(m => !m.prescriptionType || (m.prescriptionType !== 'Repeat' && m.prescriptionType !== 'Acute'));

  return (
    <div className="flex flex-col gap-6">
      <MedicationGroup title="Repeat(s)" medications={repeats} />
      <MedicationGroup title="Acute(s)"  medications={acutes} />
      {others.length > 0 && <MedicationGroup title="Other" medications={others} />}
    </div>
  );
}
