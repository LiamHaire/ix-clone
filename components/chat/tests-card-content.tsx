'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { Patient } from '@/lib/patientData';

type Investigation = Patient['investigations'][number];

const FLAG_STYLES: Record<string, string> = {
  'Normal':          'border-primary/40 bg-primary/8 text-primary',
  'Borderline high': 'border-warning/40 bg-warning/8 text-warning',
  'Abnormal':        'border-destructive/40 bg-destructive/8 text-destructive',
};

function FlagBadge({ flag }: { flag: string }) {
  const cls = FLAG_STYLES[flag] ?? 'border-border bg-muted text-muted-foreground';
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${cls}`}>
      {flag}
    </span>
  );
}

interface TestGroup {
  context: string;
  date: string;
  tests: Investigation[];
}

function groupInvestigations(investigations: Investigation[]): TestGroup[] {
  const map = new Map<string, Investigation[]>();
  for (const inv of investigations) {
    const key = inv.requestContext ?? inv.requestGroup ?? inv.date ?? 'Unknown';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(inv);
  }
  return Array.from(map.entries())
    .map(([context, tests]) => ({
      context,
      date: tests[0].date ?? '',
      tests,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function TestGroupTile({ group, index }: { group: TestGroup; index: number }) {
  return (
    <AccordionItem
      value={`test-group-${index}`}
      className="border border-border rounded-lg overflow-hidden mb-2 last:mb-0 not-last:border-b"
    >
      <AccordionTrigger className="px-3 hover:no-underline items-center gap-2">
        <span className="flex-1 text-[14px] font-medium text-foreground text-left">
          {group.context}
        </span>
        <div className="flex items-center gap-2 mr-2 shrink-0">
          <span className="text-[12px] text-muted-foreground whitespace-nowrap">{group.date}</span>
          <span className="text-[12px] text-muted-foreground">{group.tests.length} results</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="border-t border-border">
        <div className="p-4">
          <div className="flex flex-col gap-2">
            {group.tests.map((t, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <span className="text-[14px] text-foreground flex-1 min-w-0">{t.test}</span>
                <span className="text-[14px] text-muted-foreground flex-1 min-w-0 text-right truncate">{t.result}</span>
                {t.flag && (
                  <div className="shrink-0">
                    <FlagBadge flag={t.flag} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function TestsCardContent({ patient }: { patient: Patient }) {
  if (!patient.investigations || patient.investigations.length === 0) {
    return <p className="text-[14px] text-muted-foreground">No recent tests recorded.</p>;
  }

  const groups = groupInvestigations(patient.investigations);

  return (
    <Accordion multiple>
      {groups.map((group, i) => (
        <TestGroupTile key={group.context} group={group} index={i} />
      ))}
    </Accordion>
  );
}
