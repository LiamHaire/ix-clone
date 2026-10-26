'use client';

import { Warning, Flag, Envelope, ArrowSquareOut } from '@phosphor-icons/react';
import { TabbedList } from '@/components/ui/tabbed-list';
import { EmailPreviewItem } from '@/components/ui/email-preview-item';
import { Button } from '@/components/ui/button';

// ── Mock data ─────────────────────────────────────────────────────────────────

const HIGH_IMPORTANCE = [
  {
    id: '1',
    sender: 'Dr. Sarah Okafor',
    subject: 'Re: Whitmore — test results urgent',
    preview: 'Please review the latest blood panel before the appointment tomorrow morning. Two values are outside range.',
    timestamp: 'Just now',
    unread: true,
    unreadCount: 2,
    tags: ['Clinical', 'Urgent'],
  },
  {
    id: '2',
    sender: 'Legal Team',
    subject: 'Whitmore matter — deadline tomorrow',
    preview: 'The 14-day diarisation deadline falls tomorrow. Sign-off required on both outstanding items before close of business.',
    timestamp: '18 minutes ago',
    unread: true,
    tags: ['Legal'],
  },
  {
    id: '3',
    sender: 'Margaret Ellison',
    subject: 'Repeat prescription — urgent request',
    preview: 'I have run out of Metformin and my pharmacy says they have not received the prescription yet. Can you chase this?',
    timestamp: '1 hour ago',
    tags: ['Health'],
    attachments: 2,
  },
];

const FLAGGED = [
  {
    id: '4',
    sender: 'A. Pendleton',
    subject: 'Whitmore file review confirmation',
    preview: 'Can you confirm the Whitmore matter file review has been completed and sent to the client for sign-off?',
    timestamp: '2 hours ago',
    tags: ['Legal'],
  },
  {
    id: '5',
    sender: 'Reception Team',
    subject: 'Three unbooked slots next Thursday',
    preview: 'Reminder: there are three appointment slots still unbooked for Thursday afternoon. Should we open them to the waiting list?',
    timestamp: '3 hours ago',
  },
];

const UNREAD = [
  ...HIGH_IMPORTANCE.filter(e => e.unread),
  {
    id: '6',
    sender: 'Dr. Claire Moss',
    subject: 'Patient notes updated',
    preview: 'The patient notes have been updated with the revised medication plan following last week\'s review.',
    timestamp: '19 hours ago',
    unread: true,
  },
  {
    id: '7',
    sender: 'James Whitmore',
    subject: 'Sign-off items — your reference',
    preview: 'Happy to sign off on both items. Please let me know when the file is ready to send to the client.',
    timestamp: '1 day ago',
    unread: true,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function EmailInbox() {
  const unreadTotal = UNREAD.length;
  const urgentTotal = HIGH_IMPORTANCE.filter(e => e.tags?.includes('Urgent')).length;

  return (
    <TabbedList
      title="Inbox digest"
      subtitle="Showing emails from your account in the last 48 hours"
      footer={<Button variant="outline" size="sm" className="h-8 text-[13px] gap-1.5">Open mail <ArrowSquareOut size={14} /></Button>}
      defaultTab="important"
      tabs={[
        {
          id: 'important',
          label: 'High importance',
          icon: <Warning weight="duotone" />,
          items: HIGH_IMPORTANCE.map(email => (
            <EmailPreviewItem key={email.id} {...email} onClick={() => {}} />
          )),
        },
        {
          id: 'flagged',
          label: 'Flagged',
          icon: <Flag weight="duotone" />,
          items: FLAGGED.map(email => (
            <EmailPreviewItem key={email.id} {...email} onClick={() => {}} />
          )),
        },
        {
          id: 'unread',
          label: 'Unread',
          icon: <Envelope weight="duotone" />,
          items: UNREAD.map(email => (
            <EmailPreviewItem key={email.id} {...email} onClick={() => {}} />
          )),
        },
      ]}
    />
  );
}
