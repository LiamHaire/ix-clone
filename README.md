# IX Clone

A UX playground replicating the IQ conversational AI platform. Used for testing new interaction patterns and layouts without touching the GA prototype.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **ShadCN** (Base UI variant) — all components from `components/ui/`
- **Phosphor Icons** (`@phosphor-icons/react`)
- **AI SDK Elements** — chat input primitives (`components/ai-elements/`)
- **Sonner** — toast notifications
- **Geist / Geist Mono** — set globally, never override in components

## Getting started

```bash
npm install
npm run dev -- --port 3001
```

Open [http://localhost:3001](http://localhost:3001).

---

## Navigation modes

Three navigation modes toggled via chat prompt:

| Prompt | Mode |
|---|---|
| `show navrail` | **Nav Rail** — fixed 56px left rail (default) |
| `show notch` | **Notch** — original Dynamic Notch (full-width island) |
| `show alt design` | **Notch 2** — compact pill notch centred at top |

---

## Nav Rail

Fixed 56px rail on the left with:
- IQ gradient logo
- Primary nav icons (New session, Session history, Work, Knowledge base)
- App switcher dropdown (Calendar, Reporting, IQ Health, Admin, Scribe)
- Notifications popover
- Info, Settings, Avatar dropdown (Profile, Settings, Sign out)

---

## Notch (original)

Dynamic Notch-style panel anchored to the top centre. Collapses to a pill, expands to a full-width navigation panel with:
- Global search
- Recent sessions widget
- Notifications widget
- Due today tasks widget
- Apps launcher
- Avatar dropdown

### Docked pill states

| State | Visual |
|---|---|
| Idle | 24×4px rounded stroke pill |
| New notification | Bell shakes + red badge |
| Appointment reminder | Calendar icon shakes |
| Both active | Both icons side by side, pill widens |
| Report complete | FileText shake → CheckCircle → FileText + ✓ badge |

---

## Notch 2 (alt design)

Compact pill notch anchored to the top centre of the viewport. Activates via `show alt design`.

### Collapsed states

| State | Visual |
|---|---|
| Idle | 180px pill with a small horizontal stroke |
| Recording | Red border tally light, pulsing dot, `MM:SS` timer, stop button |

### Expanded panel

The notch expands to a 720px panel with a toolbar header and tabbed content views. Click any icon in the header to switch views.

#### Header icons (left → right)

| Icon | Action |
|---|---|
| Bell — **Notifications** | Lists unread notifications + View all |
| Clock — **Session history** | Recent sessions list + View all |
| Checklist — **Work** | Due today / In progress task swimlanes + View all |
| Grid — **Apps** | 4×4 app tile launcher |
| Microphone — **Start Scribe** | Starts/stops mock recording (see below) |
| Gear — **Settings** | Inline settings panel (see below) |
| Plus — **Add to Knowledge Base** | Reveals drag-and-drop upload zone |
| Avatar | Profile / Settings / Sign out dropdown |

#### Notifications view
- Lists unread notification items
- "View all" button pinned to bottom — closes notch, no full view wired yet

#### Session history view
- Lists 5 most recent sessions with title, subtitle, item count and date
- "View all" → closes notch, fires `ix:open-session-history`

#### Work view
- Two-column swimlane layout: **Due today** (left) · **In progress** (right)
- Priority dot (red = high, amber = medium, grey = low) + title + ref + assignee avatar
- "View all" → closes notch, fires `ix:open-work`

#### Apps view
- 4×4 grid of app tiles: Calendar, Reporting, IQ Health, Admin, Scribe, Knowledge, Documents, Messages, Calls, Contacts, Tasks, Billing, Time, Files, Compliance, Workflows

#### Scribe / recording
- Click the microphone icon to start a mock recording session
- Notch collapses to pill — red border (tally light), pulsing dot, running `MM:SS` timer, stop button
- Click stop button or microphone icon again to stop
- Toast: **"Recording stopped"** fires on stop

#### Settings view
- Clicking the Gear icon expands the notch to 960px wide
- Two-column layout: settings nav tree (left 200px) + scrollable settings content (right)
- Clicking any other icon returns to that view
- Gear icon shows in active/selected state while settings is open
- Max height: `100vh − 120px` with scrollable content — never runs off screen

#### Upload / Knowledge Base
- Plus button in the header reveals a drag-and-drop zone
- Dashed border, upload icon (outline, 48px), "Drag and drop to add to Knowledge Base" label
- Browse via file picker, simulated upload progress, success state
- Cancel returns to the previous view

### Behaviour details

- **Scrim** — light `rgba(0,0,0,0.25)` overlay behind expanded notch; clicking it closes
- **Tooltip delay** — 600ms open, 200ms close on all header icon buttons
- **Pointer events blocked during expand** — tooltips cannot fire while the spring-grow animation is playing
- **Min height** — 240px when expanded
- **Max height** — `calc(100vh - 120px)` to maintain 120px clearance at the bottom of the viewport

---

## Chat layout states

| State | Trigger | Layout |
|---|---|---|
| **Home** | On load / new chat | Full-width centred input + greeting |
| **Chat** | After first message | Chat panel full width |
| **Workspace** | Various prompts | Chat (1/3) · Workspace panel (2/3) |
| **Additional** | Various prompts | Chat (2/3) · Additional panel (1/3) |

In notch modes the workspace panel opens on the left, chat on the right (reversed vs nav rail).

---

## Panels

| Panel | Description |
|---|---|
| **Patient summary** | OneView patient record for Margaret Ellison |
| **Medication review** | Medication review form, saves to summary card |
| **Work** | Task and workflow management view |
| **Session history** | Past sessions grouped and searchable |
| **Settings** | App settings (appearance, chat, personalisation) |
| **Additional** | Related content or draft email side panel |

---

## Chat prompt commands

### Navigation

| Prompt | Effect |
|---|---|
| `show navrail` | Nav Rail mode |
| `show notch` | Original Notch mode |
| `show alt design` | Notch 2 mode |
| `dark` | Dark mode |
| `light` | Light mode |

### Notch event triggers

| Prompt | Effect |
|---|---|
| `new notification` | Bell shakes with badge on docked notch |
| `show meeting` | Calendar icon shakes on docked notch |
| `show report` | Report shake → check → done animation |

### Layout & data

| Prompt | Effect |
|---|---|
| `show small data` | Inline adaptive cards in chat |
| `show large data` | Opens workspace panel |
| `show additional data` | Opens additional panel |

### Demo flows

| Prompt | Effect |
|---|---|
| `next appointment` | Patient appointment card + actions |
| `file review` | File review workflow — selection, summary, email, task |
| `change address` | Address form card inline in chat |

---

## Firing notch events externally

```ts
window.dispatchEvent(new CustomEvent('ix:new-notification'));
window.dispatchEvent(new CustomEvent('ix:appointment-reminder'));
window.dispatchEvent(new CustomEvent('ix:report-complete'));
window.dispatchEvent(new CustomEvent('ix:new-chat'));
window.dispatchEvent(new CustomEvent('ix:open-work'));
window.dispatchEvent(new CustomEvent('ix:open-session-history'));
window.dispatchEvent(new CustomEvent('ix:open-settings'));
```

---

## Key files

```
app/
  page.tsx                          — app state, layout, prompt handling
  globals.css                       — design tokens, animations, themes
  layout.tsx                        — root layout, fonts, Toaster

components/
  nav-rail.tsx                      — fixed left nav rail
  nav-rail-notifications.tsx        — notifications popover for nav rail
  animated-placeholder.tsx          — rotating chat input placeholder

  nav-island/
    nav-island.tsx                  — original Notch + NavNotch2 (floating pill)
    island-mock-events.ts           — mock events, tasks, notification data

  notch2/
    notch-shell.tsx                 — Notch 2 root component, state, portal
    notch-nav.tsx                   — header toolbar with icon nav buttons
    notch-views.tsx                 — view components (notifications, sessions, work, apps)
    notch-settings.tsx              — inline settings two-column layout
    notch-drop.tsx                  — drag-and-drop upload zone + upload states
    notch-hook.ts                   — useNotchMachine hook (simulated upload)
    notch-machine.ts                — pure state machine (open/close/drop/record)

  settings/
    settings-nav.tsx                — settings tree nav
    settings-content.tsx            — settings skeleton content views
    settings-panel.tsx              — standalone settings panel (workspace mode)

  work/
    work-panel.tsx                  — work / task management panel
    task-data.ts                    — mock task lanes (Due today, In progress, Blocked)

  chat/                             — all chat panel components
  ui/                               — ShadCN Base UI components

lib/
  motion.ts                         — animation tokens (durations, easings)
  patientData.ts                    — mock patient record (Margaret Ellison)
  appointmentData.ts                — mock appointment generator
  adaptive-card-selector.ts         — picks card layouts based on prompt
```

---

## Design tokens

Defined in `app/globals.css`, documented in `DESIGN.md`. Two themes:

**Light (`:root`)** — warm graphite neutrals, hue ~71–82
**Dark (`.dark`)** — blue-shifted graphite, hue 258

Key tokens:

| Token | Use |
|---|---|
| `--background` | Page canvas |
| `--surface-raised` | Chat input, notch background |
| `--card` | Cards and panels |
| `--accent` | Hover states, selected backgrounds |
| `--border` | All borders |
| `--muted-foreground` | Secondary text, icons |
| `--destructive` | Errors, recording tally light |

Motion tokens are in `lib/motion.ts` — always use these, never hardcode durations or easings.
