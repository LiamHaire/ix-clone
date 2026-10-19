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
npm run dev -- --port 3001
```

Open [http://localhost:3001](http://localhost:3001).

---

## Features

### Navigation

Two navigation modes toggled via chat prompt:

**Nav Rail** (default) — fixed 56px rail on the left with primary nav icons, avatar dropdown, and settings.

**Nav Island** — Dynamic Island-style notch anchored to the top centre of the viewport. Collapses to a pill, expands to a full navigation panel with:
- Global search
- Recent sessions widget (View all → session history)
- Notifications widget (View all button, clickable notification items)
- Due today tasks widget (clickable tasks)
- Apps launcher (Calendar, Reporting, IQ Health, Admin, Scribe, Knowledge)
- Avatar dropdown (Profile, Settings, Sign out)

### Docked island states

When collapsed, the island pill shows animated icons for active events:

| State | Visual |
|---|---|
| Idle | 24×4px rounded stroke pill |
| New notification | Bell icon with shake animation + red badge |
| Appointment reminder | Calendar icon with shake animation |
| Both active | Both icons side by side, pill widens to 112px |
| Report shake | FileText icon shakes in |
| Report check | Cross-fades to green CheckCircle |
| Report done | Returns to FileText with green ✓ badge |

### Chat layout states

The app has three adaptive layout states:

| State | Trigger | Layout |
|---|---|---|
| **Home** | On load / new chat | Full-width centred input + greeting |
| **Chat** | After first message | Chat panel full width |
| **Workspace** | Various prompts | Chat (1/3) · Workspace panel (2/3) |
| **Additional** | Various prompts | Chat (2/3) · Additional panel (1/3) |

In island mode the workspace panel opens on the left, chat on the right (reversed vs nav rail mode).

### Panels

| Panel | Description |
|---|---|
| **Patient summary** | OneView patient record for Margaret Ellison |
| **Medication review** | Medication review form, saves to summary card |
| **Work** | Task and workflow management view |
| **Session history** | Past sessions grouped and searchable |
| **Settings** | App settings (appearance, chat, personalisation) |
| **Additional** | Related content or draft email side panel |

### Theme

- **Cool Graphite Light** — warm graphite neutrals, default
- **Cool Graphite Dark** — blue-shifted graphite (hue 258)
- Tokens defined in `app/globals.css`, documented in `DESIGN.md`

---

## Chat prompt commands

Type these into the chat input to trigger specific behaviours:

### Navigation

| Prompt | Effect |
|---|---|
| `show island` | Switches to Nav Island mode |
| `show navrail` | Switches back to Nav Rail mode |
| `Dark` | Switches to dark mode |
| `Light` | Switches to light mode |

### Island event triggers

| Prompt | Effect |
|---|---|
| `new notification` | Fires `ix:new-notification` — bell shakes with badge on docked island |
| `show meeting` | Fires `ix:appointment-reminder` — calendar icon shakes on docked island |
| `show report` | Fires `ix:report-complete` — report shake → check → done animation sequence |

### Layout & data

| Prompt | Effect |
|---|---|
| `show small data` | Inline adaptive cards in chat response |
| `show large data` | Opens workspace panel (Today's Appointments) |
| `show additional data` | Opens additional panel |

### Demo flows

| Prompt | Effect |
|---|---|
| `next appointment` | Patient appointment card with OneView / medication review actions |
| `file review` | File review workflow — random file selection, summary card, draft email, task creation |
| `change address` | Address form card inline in chat |

---

## Key files

```
app/
  page.tsx                        — entire app state, layout logic, prompt handling
  globals.css                     — design tokens, animations, theme
  layout.tsx                      — root layout, fonts

components/
  nav-rail.tsx                    — fixed left nav rail
  animated-placeholder.tsx        — rotating chat input placeholder

  nav-island/
    nav-island.tsx                — Dynamic Island nav component
    island-mock-events.ts         — mock events, tasks, and notification data

  ai-elements/
    prompt-input.tsx              — chat input primitives

  chat/
    adaptive-card-renderer.tsx    — inline card layouts
    workspace-panel.tsx           — Today's Appointments workspace panel
    additional-panel.tsx          — related content / draft email panel
    patient-summary-panel.tsx     — OneView patient summary
    medication-review-form.tsx    — medication review form + data type
    medication-review-summary-card.tsx — saved review summary
    patient-task-list.tsx         — outstanding tasks list
    patient-appointment-item.tsx  — appointment card
    progress-card.tsx             — animated progress indicator
    message-toolbar.tsx           — copy / retry actions
    thinking-text.tsx             — animated thinking indicator
    session-history-panel.tsx     — session history panel
    session-history-list.tsx      — session list + mock data
    session-result-card.tsx       — single session summary card
    index-popover.tsx             — context index popover
    settings-panel.tsx            — settings panel (in workspace)

  work/
    work-panel.tsx                — work / task management panel

  settings/
    settings-panel.tsx            — standalone settings panel

  ui/                             — ShadCN Base UI components

lib/
  patientData.ts                  — mock patient record (Margaret Ellison)
  appointmentData.ts              — mock appointment generator
  adaptive-card-selector.ts       — picks card layouts based on prompt content
```

---

## Design tokens

Tokens are defined in `app/globals.css` and documented fully in `DESIGN.md`. Two themes:

**Light (`:root`)** — warm graphite neutrals, hue ~71–82
**Dark (`.dark`)** — blue-shifted graphite, hue 258

Key dark mode surfaces:

| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.17 0.012 258)` | Page canvas |
| `--card` | `oklch(0.215 0.014 258)` | Cards and panels |
| `--surface-raised` | `oklch(0.255 0.015 258)` | Chat input, raised surfaces |
| `--sidebar-foreground` | `oklch(0.90 0.01 255)` | Nav icons |

---

## Adding new demo flows

1. Add a keyword check in `handleSubmit()` in `app/page.tsx`
2. Add the response to the `setMessages` call with any new message fields
3. Add a new component to `components/chat/` if needed
4. Render it in the messages loop inside the chat panel
5. To open a panel: call `setIsWorkspace(true)` / `setIsAdditional(true)` and set `setWorkspaceMode()`

## Firing island events from outside the component

```ts
window.dispatchEvent(new CustomEvent('ix:new-notification'));
window.dispatchEvent(new CustomEvent('ix:appointment-reminder'));
window.dispatchEvent(new CustomEvent('ix:report-complete'));
window.dispatchEvent(new CustomEvent('ix:new-chat'));
window.dispatchEvent(new CustomEvent('ix:open-work'));
window.dispatchEvent(new CustomEvent('ix:open-session-history'));
window.dispatchEvent(new CustomEvent('ix:open-settings'));
```
