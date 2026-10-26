# Email Inbox Block — Handoff Guide

## What's included

| File | Type | Purpose |
|---|---|---|
| `components/ui/item.tsx` | Primitive | Base Item layout primitives |
| `components/ui/preview-item.tsx` | Block | Generic reusable preview row |
| `components/ui/email-preview-item.tsx` | Wrapper | Email-specific preview row |
| `components/ui/task-preview-item.tsx` | Wrapper | Task-specific preview row |
| `components/ui/tabbed-list.tsx` | Block | Tabbed card container |
| `components/chat/email-inbox.tsx` | Composed block | Full email inbox digest |

---

## Step 1 — Install dependencies

```bash
npm install @base-ui/react @phosphor-icons/react class-variance-authority
```

Ensure these shadcn components exist in the target project:

```bash
npx shadcn add badge button card
```

---

## Step 2 — Copy files

Copy all files from `components/` into the target project's component directory,
preserving the folder structure:

```
components/
  ui/
    item.tsx
    preview-item.tsx
    email-preview-item.tsx
    task-preview-item.tsx
    tabbed-list.tsx
  chat/
    email-inbox.tsx
```

---

## Step 3 — Token mapping

The components use the following CSS custom properties. If the target project uses
different variable names, do a find/replace across all copied files.

### Colour tokens

| Token used | Purpose | Likely equivalent |
|---|---|---|
| `--background` | Page canvas | `--color-background` / `--bg` |
| `--foreground` | Default text | `--color-text` / `--fg` |
| `--muted` | Subdued fills | `--color-neutral-100` |
| `--muted-foreground` | Placeholder / metadata text | `--color-neutral-500` |
| `--accent` | Hover highlight | `--color-neutral-100` (hover) |
| `--accent-foreground` | Text on hover | `--color-text` |
| `--card` | Card surface | `--color-surface` / `--color-white` |
| `--card-foreground` | Text on card | `--color-text` |
| `--border` | Default dividers | `--color-neutral-200` |
| `--primary` | Brand / active states | `--color-brand` / `--color-blue-700` |
| `--primary-foreground` | Text on primary | `--color-white` |
| `--info` | Unread dot colour | `--color-blue-600` / `--color-info` |
| `--destructive` | Error / high priority | `--color-red-600` |
| `--success` | Done / success | `--color-green-600` |
| `--warning` | Medium priority | `--color-amber-500` |
| `--popover` | Floating surfaces | `--color-surface-raised` |
| `--ring` | Focus rings | `--color-brand` |

### Spacing

All spacing uses the Tailwind 4px grid (`gap-1`, `px-3`, `py-2` etc.).
No arbitrary spacing values — no remapping needed if Tailwind is configured.

### Radius

| Token | Value | Tailwind class |
|---|---|---|
| `rounded-lg` | 10px | adjust `--radius` in tailwind config |
| `rounded-xl` | 14px | |
| `rounded-full` | 9999px | |

### Typography

All text uses `text-sm` (14px), `text-xs` (12px), and `text-[11px]` (caption).
Font family inherits from `font-sans` — no remapping needed.

---

## Step 4 — Verify with Claude Code

Once files are copied and tokens mapped, run:

```
restart server
show email inbox
```

Claude Code will launch the dev server and confirm the block renders correctly.
If tokens are missing or misnamed, the AI will identify and remap them.

---

## Usage

```tsx
import { EmailInbox } from '@/components/chat/email-inbox';

// Drop into any chat message renderer, page, or panel:
<EmailInbox />
```

To use the generic block for other content types:

```tsx
import { TabbedList } from '@/components/ui/tabbed-list';
import { PreviewItem } from '@/components/ui/preview-item';
import { Bell } from '@phosphor-icons/react';

<TabbedList
  title="Notifications"
  subtitle="Your recent alerts"
  tabs={[{
    id: 'all',
    label: 'All',
    items: [
      <PreviewItem
        icon={<Bell weight="duotone" />}
        title="File review due"
        description="Whitmore matter · 3 days overdue"
        timestamp="2 minutes ago"
        unread
      />
    ]
  }]}
  footer={<Button variant="outline" size="sm">View all</Button>}
/>
```
