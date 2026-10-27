'use client';

import { useState } from 'react';
import { ArrowSquareOut, CaretDown } from '@phosphor-icons/react';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmailPreviewItem } from '@/components/ui/email-preview-item';

// ── Types ─────────────────────────────────────────────────────────────────────

interface EmailResult {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  unread?: boolean;
  tags?: string[];
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const SORT_OPTIONS = ['Newest first', 'Oldest first', 'Most relevant'];

const RESULTS: EmailResult[] = [
  { id: '1', sender: 'James Smith', subject: 'Re: Contract renewal — Smith & Associates', preview: 'Following up on our conversation last week regarding the renewal terms. Happy to discuss further.', timestamp: '2 hours ago', unread: true },
  { id: '2', sender: 'Legal Team', subject: 'Smith matter — file review complete', preview: 'The file review for the Smith matter has been completed. Two items flagged for your attention.', timestamp: '1 day ago', tags: ['Legal'] },
  { id: '3', sender: 'Sarah Smith', subject: 'Appointment request — follow-up', preview: 'I would like to book a follow-up appointment after my last visit. Please let me know your availability.', timestamp: '2 days ago' },
  { id: '4', sender: 'James Smith', subject: 'Outstanding invoice — Smith & Associates', preview: 'Please find attached the outstanding invoice for services rendered in September. Payment is due by end of month.', timestamp: '3 days ago', tags: ['Finance'] },
  { id: '5', sender: 'Reception Team', subject: 'Smith — appointment confirmed for Thursday', preview: 'This is a confirmation that the appointment for Mr James Smith has been booked for Thursday at 2:30pm.', timestamp: '4 days ago' },
  { id: '6', sender: 'Dr. Claire Moss', subject: 'Smith patient notes — medication update', preview: 'Updated notes for the Smith patient file following the medication review. Please review before the next appointment.', timestamp: '5 days ago', tags: ['Clinical'] },
  { id: '7', sender: 'James Smith', subject: 'Quick question about the file', preview: 'Hi, just a quick question about the status of the file. Could you let me know when it will be ready?', timestamp: '1 week ago' },
];

const MAX_VISIBLE = 5;

// ── Component ─────────────────────────────────────────────────────────────────

function toSentenceCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

interface EmailSearchResultsProps {
  query?: string;
  onEmailClick?: (email: { sender: string; subject: string; preview: string; timestamp: string; tags?: string[] }) => void;
}

export function EmailSearchResults({ query = 'Smith', onEmailClick }: EmailSearchResultsProps) {
  const [sort, setSort]         = useState(SORT_OPTIONS[0]);
  const [showAll, setShowAll]   = useState(false);

  const visible  = showAll ? RESULTS : RESULTS.slice(0, MAX_VISIBLE);
  const remaining = RESULTS.length - MAX_VISIBLE;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inbox search</CardTitle>
        <CardDescription>
          {RESULTS.length} email matches found for &ldquo;{toSentenceCase(query)}&rdquo;
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-[13px]">
                {sort}
                <CaretDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {SORT_OPTIONS.map(opt => (
                <DropdownMenuItem key={opt} onClick={() => setSort(opt)} className={sort === opt ? 'font-medium' : ''}>
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {visible.map(email => (
          <EmailPreviewItem key={email.id} {...email} onClick={() => onEmailClick?.(email)} />
        ))}
      </CardContent>

      <CardFooter className="gap-2 justify-end">
        {!showAll && remaining > 0 && (
          <Button variant="outline" size="sm" className="h-8 text-[13px]" onClick={() => setShowAll(true)}>
            Show {remaining} more
          </Button>
        )}
        <Button variant="ghost" size="sm" className="h-8 text-[13px] gap-1.5">
          Open mail <ArrowSquareOut size={14} />
        </Button>
      </CardFooter>
    </Card>
  );
}
