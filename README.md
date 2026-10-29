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

Two navigation modes toggled via chat prompt:

| Prompt | Mode |
|---|---|
| `show navrail` | **Nav Rail** — fixed 56px left rail (default) |
| `notch` | **Notch** — compact pill notch centred at top |

---

## Nav Rail

Fixed 56px rail on the left with:
- IQ gradient logo
- Primary nav icons (New session, Session history, Work, Knowledge base)
- App switcher dropdown (Calendar, Reporting, IQ Health, Admin, Scribe)
- Notifications popover
- Info, Settings, Avatar dropdown (Profile, Settings, Sign out)

---

## Notch

Compact pill anchored to the top centre of the viewport, mounted through a portal (`components/notch3`). Activate it with the `notch` prompt. Behaviour is specified in `docs/NOTCH_SPEC.md`; all animation uses the tokens in `lib/motion.ts` (see `docs/MOTION.md`).

### Collapsed states

| State | Visual |
|---|---|
| Idle | 180px pill with a small horizontal stroke |
| New notification / chat / calendar event | Bell, chat or calendar icon animates into the pill |
| Recording | 320px pill, destructive border, "Recording in progress..." label, `MM:SS` timer, outline **Stop** button |
| Uploading | Same width as recording. Shimmering upload icon + "Uploading...", percentage, outline **Stop** button |
| Upload complete | Success `CheckCircle`: ring pops in, check bubbles up with a spring, holds, fades out, notch closes |

The idle pill's line uses the nav rail icon colour (`--sidebar-foreground`), and its outline is the same colour at 40% opacity.

The upload-complete animation is a reusable component, `NotchComplete` (`components/notch3/notch-complete.tsx`). Render it in the collapsed pill when any background task finishes and close the notch after `NOTCH_COMPLETE_DURATION_MS`.

### Expanded panel

Click the pill to expand a 680px panel with a toolbar header and a content area.

#### Header icons (left to right)

| Icon | Action |
|---|---|
| Checklist — **Today's Tasks** | Tasks due today |
| Bell — **Notifications** | Unread notifications |
| Chat — **Chat** | Recent chats and chat detail |
| Calendar — **Calendar events** | Upcoming events |
| Lightning — **Quick actions** | Six icon-only actions (below) |
| Gear — **Settings** | Closes the notch and opens the settings panel (`ix:open-settings`) |

The notch has no avatar. In notch mode the nav rail hides its Notifications bell (the notch has its own), and keeps the avatar dropdown.

#### Item rows

Tasks, chats, notifications and calendar events all use one component, `NotchItem` (`components/ui/notch-item.tsx`), built on the ShadCN `Item` and matching the Figma "Notch item" frame: 58px muted rows with an optional orange "new" dot, an icon tile or initials ring, title and description, and trailing time, status chip, priority icon or outline buttons.

| `type` | Use |
|---|---|
| `task` | Orange ref, title, assignee, "Due" chip, priority icon |
| `message` | Initials ring, name, preview, time |
| `notification`, `event` | Icon tile, title, description (event also shows a time) |
| `approval`, `activity` | Icon tile with Approve/Deny or View/Dismiss buttons (built, not yet used in the notch) |
| `patient` | Person icon, patient name and details, View button |

Pass `bordered` for a visible border where the item appears in chat. The patient preview in the "next appointment" reply and the outstanding tasks list in the health workflow both do this, the notch rows don't. `statusTone` (`warning`, `destructive`, `primary`, `muted`) sets the status chip colour; the patient task list maps Overdue, Active, Due and Draft onto it.

#### Quick actions

Six 48px circular icon buttons with no text labels. The outline uses `--muted-foreground`. Each has a tooltip below it, with an upward arrow centred on the button, matching the nav rail tooltips.

| Icon | Action |
|---|---|
| Microphone | Start/stop Scribe (mock recording) |
| Plus | Add to Knowledge Base (opens the drop zone) |
| Timer | Start timer (coming soon) |
| Pencil | New message (coming soon) |
| Share | Share (coming soon) |
| Search | Search (coming soon) |

#### Recording (Scribe)

- Starting a recording collapses the notch to the recording pill.
- Stop with the **Stop** button or the microphone quick action. A "Recording stopped" toast fires.

#### Upload / drop flow

- Dragging files over the page expands the notch to the drop zone. Text and link drags are ignored.
- Dropping a file collapses the notch to the uploading pill, which shows simulated progress (2.4s) and a **Stop** button that cancels.
- On success the check animation plays and the notch closes.
- Validation failures expand the panel to show the error.
- The drop zone also offers click-to-browse.

### Behaviour details

- **Scrim** — light overlay behind the expanded notch; clicking it closes
- **Tooltips** — header buttons open after 600ms, quick actions after 300ms
- **Reduced motion** — spring and shrink collapse to a short fade, shimmer stops, check pops become a fade (see `docs/MOTION.md` section 6)
- **Nothing runs while hidden** — no timers or animation frames

---

## Chat layout states

| State | Trigger | Layout |
|---|---|---|
| **Home** | On load / new chat | Full-width centred input + greeting |
| **Chat** | After first message | Chat panel full width |
| **Workspace** | Various prompts | Chat (1/3) · Workspace panel (2/3) |
| **Additional** | Various prompts | Chat (2/3) · Additional panel (1/3) |

Panels open and close with a spring (workspace and additional panels overshoot slightly, closing uses a plain curve), and swapping between workspace and additional moves the divider with an overshoot in its direction of travel. This is an experiment: set `PANEL_SPRING_EXPERIMENT = false` in `lib/motion.ts` to go back to the original slide (see `docs/MOTION.md` section 4.4). All workspace and additional panels use the same `--background` as the chat panel.

In notch mode the workspace panel opens on the left, chat on the right (reversed vs nav rail).

---

## Panels

| Panel | Description |
|---|---|
| **Patient summary** | OneView patient record for Margaret Ellison |
| **Medication review** | Medication review form, saves to summary card |
| **Work** | Task management — swimlane board + paginated sortable table, stat tiles, priority filter, sort dropdown, hide-chat mode |
| **Session history** | Past sessions grouped and searchable |
| **Settings** | App settings (appearance, chat, personalisation) |
| **Additional** | Related content or draft email side panel |

---

## Chat prompt commands

### Navigation

| Prompt | Effect |
|---|---|
| `show navrail` | Nav Rail mode |
| `notch` | Notch mode |
| `dark` | Dark mode |
| `light` | Light mode |

### Notch event triggers

| Prompt | Effect |
|---|---|
| `new notification` | Bell animates into the docked notch |
| `show meeting` | Calendar icon animates into the docked notch |
| `new message` | Chat icon animates into the docked notch |

### Layout & data

| Prompt | Effect |
|---|---|
| `show small data` | Inline adaptive cards in chat |
| `show large data` | Opens workspace panel |
| `show additional data` | Opens additional panel |
| `hide chat` | Hides chat panel in Work view, expands work area to 1600px |
| `show chat` | Restores chat panel in Work view |

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

  notch3/
    index.tsx                       — NavNotch3 entry point
    notch3-shell.tsx                — root component: state, portal, collapsed pills, drag/drop listeners
    notch3-nav.tsx                  — header toolbar, shared tooltip, avatar menu
    notch3-views.tsx                — content views (tasks, notifications, chat, calendar, quick actions)
    notch-drop.tsx                  — drop zone + upload/success/error views
    notch-complete.tsx              — reusable collapsed "complete" check animation
    notch-hook.ts                   — useNotchMachine hook (simulated upload progress)
    notch-machine.ts                — pure state machine (open/close/drag/drop/progress)

  settings/
    settings-nav.tsx                — settings tree nav
    settings-content.tsx            — settings skeleton content views
    settings-panel.tsx              — standalone settings panel (workspace mode)

  work/
    work-panel.tsx                  — work / task management panel (stat tiles, toolbar, board/table toggle, hide-chat mode)
    work-nav.tsx                    — left nav tree (Tasks, Workflows sections)
    task-board.tsx                  — TaskBoard (swimlane) + TaskTable (paginated, sortable, Shadcn table)
    task-data.ts                    — 25 mock health tasks across Due today, In progress, Blocked lanes
    assignee-avatar.tsx             — avatar with tooltip, per-user colour palette

  chat/                             — all chat panel components
  ui/                               — ShadCN Base UI components
    notch-item.tsx                  — shared item row (notch tasks/chats/alerts, chat patient preview)

lib/
  motion.ts                         — animation tokens (durations, easings)
  patientData.ts                    — mock patient record (Margaret Ellison)
  appointmentData.ts                — mock appointment generator
  adaptive-card-selector.ts         — picks card layouts based on prompt
```

---

## Docs

| File | Contents |
|---|---|
| `docs/MOTION.md` | Motion tokens, animation inventory, reduced-motion behaviour |
| `docs/NOTCH_SPEC.md` | Notch behaviour, state machine and drop flow |
| `DESIGN.md` | Design tokens |

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
| `--destructive` | Errors, recording tally light. Dark mode uses a softer red with dark `--destructive-foreground` text on red fills |
| `--chart-1` | Orange accent (notch "new" dot, task refs). Dark mode uses a softer orange |

Motion tokens are in `lib/motion.ts` — always use these, never hardcode durations or easings.
