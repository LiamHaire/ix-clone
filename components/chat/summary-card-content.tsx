'use client';

import { CaretDown, CaretUp, CaretDoubleUp } from '@phosphor-icons/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { Patient } from '@/lib/patientData';

// ── Complexity / Risk chip ────────────────────────────────────────────────────

type Level = 'Low' | 'Moderate' | 'High';

const LEVEL_STYLES: Record<Level, { chip: string; icon: string }> = {
  Low:      { chip: 'border-success/40 bg-success/8 text-success',             icon: 'text-success' },
  Moderate: { chip: 'border-warning/40 bg-warning/8 text-warning',             icon: 'text-warning' },
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

// ── Allergy severity / type badge ─────────────────────────────────────────────

const SEVERITY_STYLES: Record<string, string> = {
  Mild:     'border-success/40 bg-success/8 text-success',
  Moderate: 'border-warning/40 bg-warning/8 text-warning',
  Severe:   'border-destructive/40 bg-destructive/8 text-destructive',
};

function AllergyBadge({ label, variant = 'default' }: { label: string; variant?: 'severity' | 'default' }) {
  const cls = variant === 'severity'
    ? (SEVERITY_STYLES[label] ?? 'border-border bg-muted text-muted-foreground')
    : 'border-border bg-muted/50 text-muted-foreground';
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${cls}`}>
      {label}
    </span>
  );
}

// ── Section heading with rule ─────────────────────────────────────────────────

function SectionHeading({ title, first = false }: { title: string; first?: boolean }) {
  return (
    <div className={first ? 'mb-3' : 'mt-6 mb-3'}>
      <p className="text-[13px] font-semibold text-foreground">{title}</p>
      <div className="border-t border-border mt-2" />
    </div>
  );
}

// ── Sub-heading (Drug / Non-drug / Lifestyle / Examinations) ──────────────────

function SubHeading({ title }: { title: string }) {
  return (
    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
      {title}
    </p>
  );
}

// ── Detail row inside expanded accordion ─────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-[14px] text-muted-foreground w-28 shrink-0">{label}</span>
      <span className="text-[14px] text-foreground">{value}</span>
    </div>
  );
}

// ── Allergy accordion tile ────────────────────────────────────────────────────

function AllergyTile({ allergy, index }: { allergy: Patient['allergies'][number]; index: number }) {
  const drugDetails = allergy.drugForm
    ? [allergy.drugForm, allergy.strength].filter(Boolean).join(' · ')
    : null;

  return (
    <AccordionItem
      value={`allergy-${index}`}
      className="border border-border rounded-lg overflow-hidden mb-2 last:mb-0 not-last:border-b"
    >
      <AccordionTrigger className="px-3 hover:no-underline items-center gap-2">
        <span className="flex-1 text-[14px] font-medium text-foreground text-left">
          {allergy.substance}
        </span>
        <div className="flex items-center gap-1.5 mr-2">
          {allergy.recordedDate && (
            <span className="text-[12px] text-muted-foreground">{allergy.recordedDate}</span>
          )}
          {allergy.type && <AllergyBadge label={allergy.type} />}
          {allergy.severity && <AllergyBadge label={allergy.severity} variant="severity" />}
        </div>
      </AccordionTrigger>
      <AccordionContent className="border-t border-border">
        <div className="flex flex-col gap-5 p-4">
          {allergy.reaction && <DetailRow label="Reaction" value={allergy.reaction} />}
          {allergy.severity && <DetailRow label="Severity" value={allergy.severity} />}
          {allergy.status && <DetailRow label="Status" value={allergy.status} />}
          {allergy.recordedBy && <DetailRow label="Recorded by" value={allergy.recordedBy} />}
          {allergy.recordedDate && <DetailRow label="Recorded" value={allergy.recordedDate} />}
          {drugDetails && <DetailRow label="Drug form" value={drugDetails} />}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// ── Flat lifestyle / examination row ──────────────────────────────────────────

function EntryRow({ term, value, date }: { term: string; value: string; date: string }) {
  return (
    <div className="flex items-center justify-between py-3 [&:not(:last-child)]:border-b border-border">
      <span className="text-[14px] font-medium text-foreground px-2">{term}</span>
      <div className="flex items-center gap-3 px-2">
        <span className="text-[14px] text-muted-foreground text-right">{value}</span>
        <span className="text-[12px] text-muted-foreground/60 whitespace-nowrap">{date}</span>
      </div>
    </div>
  );
}

// ── Exported card content ─────────────────────────────────────────────────────

export function SummaryCardContent({ patient }: { patient: Patient }) {
  const { aiSummary, allergies, lifestyleEntries, examinationEntries } = patient;

  const drugAllergies    = allergies.filter(a => a.type === 'Drug');
  const nonDrugAllergies = allergies.filter(a => a.type !== 'Drug');

  // Lifestyle flat rows
  const le = lifestyleEntries;
  const lifestyleRows: { term: string; value: string; date: string }[] = [];
  if (le) {
    if (le.occupation) lifestyleRows.push({ term: le.occupation.term, value: le.occupation.value, date: le.occupation.date });
    if (le.smoking) {
      const v = le.smoking.consumption ? `${le.smoking.status} · ${le.smoking.consumption}` : le.smoking.status;
      lifestyleRows.push({ term: le.smoking.term, value: v, date: le.smoking.date });
    }
    if (le.alcohol)   lifestyleRows.push({ term: le.alcohol.term, value: le.alcohol.consumption, date: le.alcohol.date });
    if (le.diet) {
      const v = le.diet.type ? `${le.diet.habit} · ${le.diet.type}` : le.diet.habit;
      lifestyleRows.push({ term: le.diet.term, value: v, date: le.diet.date });
    }
    if (le.residence) lifestyleRows.push({ term: le.residence.term, value: le.residence.type, date: le.residence.date });
  }

  // Examination flat rows
  const ee = examinationEntries;
  const examRows: { term: string; value: string; date: string }[] = [];
  if (ee) {
    if (ee.weight) {
      const v = ee.weight.bmi ? `${ee.weight.value} · BMI ${ee.weight.bmi}` : ee.weight.value;
      examRows.push({ term: ee.weight.term, value: v, date: ee.weight.date });
    }
    if (ee.bloodPressure) examRows.push({ term: ee.bloodPressure.term, value: `${ee.bloodPressure.systolic}/${ee.bloodPressure.diastolic} mmHg`, date: ee.bloodPressure.date });
    if (ee.pulse)            examRows.push({ term: ee.pulse.term, value: ee.pulse.value, date: ee.pulse.date });
    if (ee.oxygenSaturation) examRows.push({ term: ee.oxygenSaturation.term, value: `${ee.oxygenSaturation.value}${ee.oxygenSaturation.unit}`, date: ee.oxygenSaturation.date });
    if (ee.temperature) {
      const v = ee.temperature.qualifier
        ? `${ee.temperature.value} ${ee.temperature.unit} · ${ee.temperature.qualifier}`
        : `${ee.temperature.value} ${ee.temperature.unit}`;
      examRows.push({ term: ee.temperature.term, value: v, date: ee.temperature.date });
    }
  }

  return (
    <>
      {/* Complexity + Risk */}
      <div className="flex items-center gap-3 flex-wrap">
        <ComplexityChip level={aiSummary.complexity} label="Complexity" />
        <ComplexityChip level={aiSummary.risk}       label="Risk" />
      </div>

      {/* Condensed AI paragraph */}
      <p className="text-[14px] text-muted-foreground leading-relaxed">
        {aiSummary.longitudinalSummary}
      </p>

      {/* ── Allergies ───────────────────────────────────────────────────── */}

      {drugAllergies.length > 0 && (
        <div>
          <SubHeading title="Drug allergies" />
          <Accordion multiple>
            {drugAllergies.map((a, i) => (
              <AllergyTile key={a.substance} allergy={a} index={i} />
            ))}
          </Accordion>
        </div>
      )}

      <div>
        <SubHeading title="Non-drug allergies" />
        {nonDrugAllergies.length > 0 ? (
          <Accordion multiple>
            {nonDrugAllergies.map((a, i) => (
              <AllergyTile key={a.substance} allergy={a} index={drugAllergies.length + i} />
            ))}
          </Accordion>
        ) : (
          <p className="text-[14px] text-muted-foreground">No known non-drug allergies</p>
        )}
      </div>

      {/* ── Lifestyle & Examinations ─────────────────────────────────────── */}

      {lifestyleRows.length > 0 && (
        <div>
          <SubHeading title="Lifestyle" />
          <div>
            {lifestyleRows.map(r => <EntryRow key={r.term} {...r} />)}
          </div>
        </div>
      )}

      {examRows.length > 0 && (
        <div>
          <SubHeading title="Examinations" />
          <div>
            {examRows.map(r => <EntryRow key={r.term} {...r} />)}
          </div>
        </div>
      )}
    </>
  );
}
