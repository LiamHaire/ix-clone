# IX Clone

A UX playground replicating the IQ conversational AI platform. Used for testing new interaction patterns and layouts without touching the GA prototype.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **ShadCN** (Base UI variant) — all components from `components/ui/`
- **Phosphor Icons** (`@phosphor-icons/react`)
- **AI SDK Elements** — chat input primitives (`components/ai-elements/`)
- **Geist / Geist Mono** — set globally, never override in components

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is in use, pick any free port:

```bash
npm run dev -- --port 3001
```

## Layout overview

The app is a single page (`app/page.tsx`) with three adaptive states:

| State | Trigger | Layout |
|---|---|---|
| **Home** | On load / New chat | Full-width centred chat input + greeting |
| **Chat** | After first message | Chat panel full width, left |
| **Workspace** | Type `show large data` | Chat left (1/3) · Workspace panel right (2/3) |
| **Additional** | Type `show additional data` | Chat left (2/3) · Additional panel right (1/3) |

Chat is always on the left in split views. Both panels animate in/out with a spring transition.

## Text commands

Type these into the chat input to trigger specific demo flows:

| Command | What it shows |
|---|---|
| `show small data` | Inline adaptive cards in the chat response |
| `show large data` | Opens workspace panel (Today's Appointments) on the right |
| `show additional data` | Opens additional panel on the right |
| `next appointment` | Patient appointment card with follow-up actions |
| `file review` | File review flow — radio options, summary card, draft email |
| `change address` | Address form card inline in chat |

## Navigation

The **floating action bar** sits top-right of the chat panel (and home view), tracking the chat surface through all layout changes.

| Button | Action |
|---|---|
| Pencil | New chat — resets to home |
| Clock | Chat history (not yet wired) |
| Grid | App switcher (not yet wired) |
| Wrench | Tools (not yet wired) |
| ··· | More (not yet wired) |
| JS avatar | Opens dropdown: Profile · Settings · Sign out |

## Key files

```
app/
  page.tsx                        — entire app state and layout logic

components/
  floating-action-bar.tsx         — top-right nav pill
  animated-placeholder.tsx        — rotating chat input placeholder
  ai-elements/prompt-input.tsx    — chat input primitives

  chat/
    adaptive-card-renderer.tsx    — renders inline card layouts
    workspace-panel.tsx           — large data panel (right)
    additional-panel.tsx          — small data panel (right)
    patient-summary-panel.tsx     — OneView patient summary
    medication-review-form.tsx    — medication review form
    patient-task-list.tsx         — outstanding tasks list
    patient-appointment-item.tsx  — appointment card
    progress-card.tsx             — animated progress indicator
    message-toolbar.tsx           — copy / retry / feedback actions
    thinking-text.tsx             — animated thinking indicator
    address-form-card.tsx         — address capture inline card

  ui/                             — ShadCN Base UI components
  ui/iqons/                       — custom IQ icon set (React + SVG)
  blocks/                         — reusable address block

lib/
  patientData.ts                  — mock patient record (Margaret Ellison)
  appointmentData.ts              — mock appointment generator
  adaptive-card-selector.ts       — picks card layouts based on prompt content
```

## Design tokens

Warm IQ palette defined in `app/globals.css`:

| Token | Value | Use |
|---|---|---|
| `--background` | `#F8F4EF` | Page background |
| `--foreground` | `#1D1710` | Primary text |
| `--muted-foreground` | `#776B5A` | Secondary text, placeholders |
| `--border` | `#E9E4DB` | Borders |
| `--surface-raised` | `#FDFBF8` | Card / input surfaces |

## Adding new demo flows

1. Add a keyword check in `handleSubmit()` in `app/page.tsx`
2. Add the response to the `setMessages` call (with any new message fields)
3. Add a new component to `components/chat/` if needed
4. Render it in the messages loop inside the chat panel
5. To trigger a panel: call `setIsWorkspace(true)` or `setIsAdditional(true)` inside `applyLayout()`

## IQons

Custom icon set at `components/ui/iqons/`. Each icon exports a React component accepting `size`, `variant` (`outline` | `fill` | `duotone`), and `className`.

```tsx
import { Allergies } from "@/components/ui/iqons"
<Allergies size={20} variant="duotone" />
```

SVG source files are in `public/icons/iqons/`.
