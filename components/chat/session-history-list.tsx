"use client";

import { Accordion, AccordionItem, AccordionContent } from "@/components/ui/accordion";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FileText, FilePdf, Table, UserCircle, CalendarCheck, ClipboardText, Files,
  DotsThreeVertical, ArrowCounterClockwise, Trash, PencilSimple, Export, PushPin,
} from "@phosphor-icons/react";

export interface IndexEntry {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface Session {
  id: string;
  title: string;
  subtitle: string;
  isoDate: string;
  startedDate: string;
  itemCount: number;
  summary: string;
  index: IndexEntry[];
}

export const MOCK_SESSIONS: Session[] = [
  {
    id: "1",
    title: "Medication review — Margaret Ellison",
    subtitle: "Patient summary · OneView",
    isoDate: "2026-10-12T14:32:00",
    startedDate: "2026-10-12T14:08:00",
    itemCount: 6,
    summary: "Reviewed current medications for Margaret Ellison ahead of her scheduled appointment. Identified a potential interaction between Metformin and newly prescribed Lisinopril. A medication review form was completed and saved, with the next review scheduled in 3 months.",
    index: [
      { icon: UserCircle,    title: "Margaret Ellison — OneView",         description: "Patient summary · Viewed" },
      { icon: ClipboardText, title: "Medication review form",             description: "Completed and saved" },
      { icon: FilePdf,       title: "Repeat prescription — Metformin",   description: "Document · Viewed" },
      { icon: FilePdf,       title: "Repeat prescription — Lisinopril",  description: "Document · Viewed" },
      { icon: CalendarCheck, title: "Follow-up appointment",             description: "Scheduled · 3 months" },
      { icon: Files,         title: "Interaction report",                description: "Generated · Viewed" },
    ],
  },
  {
    id: "2",
    title: "File compliance checks — Whitmore matter",
    subtitle: "File review · Compliance",
    isoDate: "2026-10-12T09:15:00",
    startedDate: "2026-10-12T09:02:00",
    itemCount: 4,
    summary: "Performed a compliance file review on the Whitmore conveyancing matter. The file scored 95% with a missing conflict check identified. A task was assigned to the owning fee earner with a 14-day deadline diarised.",
    index: [
      { icon: Files,         title: "Whitmore matter — file review",     description: "CON-2026-0626 · Reviewed" },
      { icon: FileText,      title: "Conflict check checklist",          description: "Document · Action required" },
      { icon: ClipboardText, title: "Fee earner task",                   description: "Created · Assigned to A. Pendleton" },
      { icon: CalendarCheck, title: "14-day deadline",                   description: "Diarised" },
    ],
  },
  {
    id: "3",
    title: "Settlement agreement — Hendricks case",
    subtitle: "Document review · Litigation",
    isoDate: "2026-10-11T16:48:00",
    startedDate: "2026-10-11T16:21:00",
    itemCount: 9,
    summary: "Reviewed draft settlement agreement for the Hendricks litigation case. Opposing counsel indicated willingness to settle. The draft was reviewed by Arthur Pendleton prior to circulation. Key terms and liability clauses were flagged for further discussion.",
    index: [
      { icon: FilePdf,       title: "Draft settlement agreement v3",     description: "Document · Reviewed" },
      { icon: FileText,      title: "Counsel correspondence",            description: "Email · Viewed" },
      { icon: UserCircle,    title: "Arthur Pendleton — matter view",    description: "Fee earner profile · Viewed" },
      { icon: Table,         title: "Liability clause summary",          description: "Generated · Viewed" },
      { icon: ClipboardText, title: "Review notes",                      description: "Created" },
    ],
  },
  {
    id: "4",
    title: "Client contact update — Whitmore",
    subtitle: "Matter management",
    isoDate: "2026-10-11T11:20:00",
    startedDate: "2026-10-11T11:14:00",
    itemCount: 3,
    summary: "Updated contact details for the Whitmore clients following a change of correspondence address confirmed by phone. The case management system was updated and the fee earner notified.",
    index: [
      { icon: UserCircle,    title: "Whitmore — client record",          description: "Contact details · Updated" },
      { icon: FileText,      title: "Fee earner notification",           description: "Email · Sent" },
      { icon: Files,         title: "Whitmore matter",                   description: "CON-2026-0626 · Viewed" },
    ],
  },
  {
    id: "5",
    title: "Appointment — Dr Sarah Okafor",
    subtitle: "Patient summary · Scheduling",
    isoDate: "2026-10-10T10:05:00",
    startedDate: "2026-10-10T09:48:00",
    itemCount: 5,
    summary: "Viewed upcoming appointment details for Dr Sarah Okafor. Patient summary reviewed ahead of the consultation. Outstanding tasks noted and a follow-up action created for medication reconciliation.",
    index: [
      { icon: CalendarCheck, title: "Appointment · Dr Sarah Okafor",     description: "Upcoming · Viewed" },
      { icon: UserCircle,    title: "Patient OneView",                   description: "Summary · Viewed" },
      { icon: ClipboardText, title: "Outstanding tasks",                 description: "3 tasks · Reviewed" },
      { icon: FilePdf,       title: "Recent test results",               description: "Document · Viewed" },
      { icon: ClipboardText, title: "Medication reconciliation task",    description: "Created" },
    ],
  },
  {
    id: "6",
    title: "Quarterly reporting — Q3 summary",
    subtitle: "Reporting · Analytics",
    isoDate: "2026-10-09T15:30:00",
    startedDate: "2026-10-09T14:55:00",
    itemCount: 7,
    summary: "Generated and reviewed the Q3 quarterly summary report. Key metrics across compliance, caseload, and fee income were reviewed. Two areas flagged for improvement: file review completion rate and overdue matter tasks.",
    index: [
      { icon: Table,         title: "Q3 summary report",                 description: "Generated · Viewed" },
      { icon: Table,         title: "Compliance metrics",                description: "Report · Viewed" },
      { icon: Table,         title: "Caseload overview",                 description: "Report · Viewed" },
      { icon: Table,         title: "Fee income breakdown",              description: "Report · Viewed" },
      { icon: ClipboardText, title: "Improvement action — file reviews", description: "Flagged" },
      { icon: ClipboardText, title: "Improvement action — overdue tasks", description: "Flagged" },
      { icon: FilePdf,       title: "Q3 report export",                  description: "PDF · Generated" },
    ],
  },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDateOnly(isoDate: string): string {
  const d = new Date(isoDate);
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
}

function formatDateTime(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const today     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const sessionDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const time = `${hh}:${mm}`;
  const diffMs = now.getTime() - d.getTime();
  if (diffMs < 60000) return "Just now";
  if (sessionDay.getTime() === today.getTime()) return `Today at ${time}`;
  if (sessionDay.getTime() === yesterday.getTime()) return `Yesterday at ${time}`;
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}-${MONTHS[d.getMonth()]}-${d.getFullYear()} at ${time}`;
}

interface SessionHistoryListProps {
  search: string;
  onPreview: (entry: IndexEntry) => void;
}

export function SessionHistoryList({ search, onPreview }: SessionHistoryListProps) {
  const filtered = MOCK_SESSIONS.filter(s =>
    !search ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">No sessions found</p>
      </div>
    );
  }

  return (
    <Accordion variant="bordered" className="w-full">
      {filtered.map(session => (
        <AccordionItem key={session.id} value={session.id}>
          <AccordionPrimitive.Header className="flex items-center">

            {/* Trigger */}
            <AccordionPrimitive.Trigger
              className={cn(
                "group/accordion-trigger relative flex flex-1 items-center gap-3 py-3 px-3 text-left transition-all outline-none",
                "rounded-lg border border-transparent",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "aria-disabled:pointer-events-none aria-disabled:opacity-50"
              )}
            >
              <span className="shrink-0 text-muted-foreground">
                <ChevronDownIcon className="size-4 pointer-events-none group-aria-expanded/accordion-trigger:hidden" />
                <ChevronUpIcon className="size-4 pointer-events-none hidden group-aria-expanded/accordion-trigger:inline" />
              </span>
              <span className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground truncate">{session.title}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {session.subtitle}
                  <span className="mx-2">·</span>
                  {session.itemCount} {session.itemCount === 1 ? "item" : "items"}
                </span>
              </span>
              <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0 mr-1">
                {formatDateTime(session.isoDate)}
              </span>
            </AccordionPrimitive.Trigger>

            {/* Ellipsis menu — outside trigger, inside header */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    className="flex items-center justify-center size-7 rounded-full mr-2 shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Session actions"
                    onClick={e => e.stopPropagation()}
                  />
                }
              >
                <DotsThreeVertical size={15} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={4} className="min-w-44">
                <DropdownMenuItem className="gap-2">
                  <ArrowCounterClockwise size={14} className="text-muted-foreground" />
                  Continue session
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <PencilSimple size={14} className="text-muted-foreground" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Export size={14} className="text-muted-foreground" />
                  Export summary
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <PushPin size={14} className="text-muted-foreground" />
                  Pin to top
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                  <Trash size={14} />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </AccordionPrimitive.Header>

          <AccordionContent className="px-3 pb-4 [&_p:not(:last-child)]:mb-0">
            <div className="flex flex-col gap-4 pt-1 border-t border-border">

              <div className="pt-3 pl-7">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Summary</p>
                <p className="text-sm text-foreground leading-relaxed mt-2">{session.summary}</p>
              </div>

              <div className="pl-7">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Index</p>
                <div className="flex flex-col gap-1 mt-2">
                  {session.index.map((entry, i) => (
                    <Item
                      key={i}
                      variant="outline"
                      size="sm"
                      render={<button onClick={() => onPreview(entry)} />}
                      className="cursor-pointer hover:bg-accent transition-colors text-left w-full"
                    >
                      <ItemMedia variant="icon">
                        <entry.icon size={16} weight="duotone" className="text-muted-foreground" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{entry.title}</ItemTitle>
                        <ItemDescription>{entry.description}</ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="pl-7 pb-1 flex items-center gap-3">
                <span className="text-[12px] text-muted-foreground">Session started {formatDateOnly(session.startedDate)}</span>
                <span className="text-muted-foreground/40 text-[12px]">·</span>
                <span className="text-[12px] text-muted-foreground">Last active {formatDateOnly(session.isoDate)}</span>
              </div>

            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
