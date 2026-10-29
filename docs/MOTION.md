# Motion

How things move in this app. Use the tokens in section 2 for any new
animation. Section 4 lists what exists today.

Source of truth: `lib/motion.ts` (JS) and the `:root` block in
`app/globals.css` (CSS). They must always match. Change both in the same
commit.

---

## 1. Principles

1. **Grow with a spring, shrink with a curve.** Things that open or enlarge
   overshoot slightly and settle. Things that close glide out quickly with no
   bounce.
2. **Motion explains state changes.** If an animation does not show where
   something came from or went to, remove it.
3. **Interruptible.** A user can reverse any transition mid-flight and the
   result must still look intentional.
4. **Nothing runs when nothing is visible.** No timers, `requestAnimationFrame`
   or polling while the notch is hidden.
5. **Reduced motion is a first-class mode** (section 6).
6. **Prefer `transform` and `opacity`.** The notch's own width, height and
   corner radius are the only deliberate exception (section 3).

---

## 2. Tokens

### Shared

| CSS variable | Value | Use |
|---|---|---|
| `--ease-spring-grow`, `--dur-spring-grow` | sampled spring, 800ms, about 3.8% overshoot | Anything that opens, enlarges or swaps to a taller view |
| `--ease-shrink`, `--dur-shrink` | `cubic-bezier(0.45, 0, 0.2, 1)`, 340ms | Anything that closes, reduces or swaps to a shorter view |
| `--ease-out-cubic` | `cubic-bezier(0.215, 0.61, 0.355, 1)` | Fades in, reveals, hover and selected state |
| `--ease-in-cubic` | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | Exits. Currently unused by any component |
| `--ease-in-out-cubic` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | Travel between two resting positions |
| `--ease-back-out` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Pop-ins with a small overshoot |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Layout moves: panel resize, chat move, tab indicator |
| `--ease-standard` | `cubic-bezier(0.25, 0.1, 0.25, 1)` (the CSS `ease` curve) | Opacity fades that were tuned with plain `ease` |
| `--dur-fast` | 120ms | Notch hover, press, selected state |
| `--dur-hover` | 150ms | Standard hover and colour changes. Also Tailwind's default transition duration, so `transition-colors` uses it |
| `--dur-base` | 200ms | Fades, small reveals |
| `--dur-panel-resize` | 500ms | Chat and workspace `flex`, page `max-width` |

### Component-specific

Named `--dur-{component}-{part}` (or `--ease-...`) when only one component uses
them.

| CSS variable | Value | Used by |
|---|---|---|
| `--dur-chat-reveal` | 350ms | Chat content opacity reveal in `app/page.tsx` |
| `--dur-tabs-indicator` | 250ms | Tabbed list sliding indicator |
| `--dur-placeholder-roll` | 400ms | Animated placeholder roll and fade |
| `--ease-placeholder-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Animated placeholder exit |
| `--dur-thinking-dot` | 130ms | Thinking indicator dot fill |
| `--dur-thinking-text` | 250ms | Thinking text swap |
| `--dur-notch-success` | 250ms | Notch drop-zone success check |
| `--dur-notch-check-ring`, `--dur-notch-check-bubble`, `--dur-notch-check-delay`, `--dur-notch-check-hold` | 300ms, 500ms, 180ms, 1400ms | Reusable collapsed-notch "complete" animation: `<NotchComplete label="..." />` in `components/notch3/notch-complete.tsx` (close the notch after `NOTCH_COMPLETE_DURATION_MS`). Classes `.n3-success-ring`, `.n3-success-check`, `.n3-success-out`): ring pops in, check bubbles up with a spring overshoot, holds static, then the pill content fades out over `--dur-base`. The notch closes after hold plus `--dur-base`. Reduced motion swaps the pops for `notch-icon-fade-in` |
| `--dur-notch-shimmer` | 1800ms | Notch uploading pill shimmer (`.n3-upload-shimmer`, infinite, mask sweep over icon and text; stops under reduced motion; only exists while uploading, so never runs while hidden) |

In TypeScript, `lib/motion.ts` exports the same values (`SPRING_GROW`,
`SPRING_GROW_DURATION_MS`, `SHRINK_MS`, the `EASE_*` and `DUR_*` constants,
`PANEL_RESIZE_MS`, the `CHAT_*_MS` set, and the component-specific `*_MS`
constants) plus a `CSS` object of `var(--...)` references for inline styles.
The chat sequence timings (`CHAT_MOVE_MS` 550, `CHAT_FADE_MS` 400,
`CHAT_OVERLAY_FADE_MS` 500) are JS constants because timers use them as well as
transitions.

### Which tool for which job

| Situation | Approach |
|---|---|
| Size, radius or position between known states | CSS `transition` with the tokens |
| Notch view swap | Taller or equal view uses spring grow, shorter view uses shrink |
| Hover, focus, selected state | CSS, `--dur-hover` or `--dur-fast` with `--ease-out-cubic` |
| One-shot icon entrance | A named keyframe in `app/globals.css` (section 4.3) |
| Staggered or sequenced reveal | CSS `animation-delay`, or a single `setTimeout` tied to a token duration |

Do not add an animation library unless CSS cannot meet a written requirement.

### Known limit of CSS springs

A CSS transition retargeted mid-flight keeps position but loses velocity, so
reversing an expand can look slightly abrupt. Accepted.

---

## 3. Layout-affecting properties

Animate `transform` and `opacity` wherever possible.

**Deliberate exception:** the notch animates `width`, `height` and
`border-radius`, because its silhouette is the effect. It is one fixed-position
element with fixed target sizes per view, so nothing reflows around it. Do not
copy this to list items, cards or anything in normal document flow.

Also required for the notch:

- Mount through a portal at the document root. A parent with `transform`,
  `filter` or `contain` breaks fixed positioning.
- Keep per-view heights as fixed numbers. Do not transition to `auto`.

Other layout-property animations, each tolerated for the reason given:

| Where | Property | Reason |
|---|---|---|
| Tabbed list indicator | `left`, `width` | Absolutely positioned inside the tab list, no reflow |
| Chat and workspace split (`app/page.tsx`) | `flex` | Panels resize against each other by design |
| Work, settings, session history, summary and workspace panels | `max-width` | Single container, expand and collapse only |

---

## 4. Animation inventory

### 4.1 Notch (`components/notch3`)

| Part | What moves | Timing |
|---|---|---|
| Panel open | `width`, `height`, `border-radius` | spring grow |
| Panel close | `width`, `height`, `border-radius` | shrink |
| Border colour, shadow | `border-color`, `box-shadow` | `--dur-base`, ease out |
| Scrim | `opacity` via `notch-scrim-in` | `--dur-base`, ease out |
| Content on open | `opacity`, `translateY(-6px)` to 0 via `notch-expand-content` | `--dur-base`, ease out |
| Header controls | appear after the spring settles | one timer of `SPRING_GROW_DURATION_MS` |
| Nav buttons | `background-color`, `color` | `--dur-fast`, ease out |
| Recording indicator, unread dots | `animate-pulse` | Tailwind default, infinite. Must not run while the notch is hidden |
| Tooltips | fade and zoom (`animate-in`, `fade-in-0`, `zoom-in-95`) | Tailwind animate utilities |

### 4.2 Drop and upload (`components/notch3/notch-drop.tsx`)

| Part | What moves | Timing |
|---|---|---|
| Drop zone border and background | `border-color`, `background` | `--dur-base`, ease out |
| Browse link colour | `color` | `--dur-fast`, ease out |
| Progress bar | `width` | `--dur-fast`, ease out |
| Success check | `notch-success-pop`: scale 0.6 to 1.15 to 1, fade in | `--dur-notch-success`, back out |

Upload progress is simulated in `notch-hook.ts` on a 50ms interval over 2.4s,
using ease-out, ease-in-out and ease-in cubic curves (fast start, plateau, final
push). The interval is cleared on close, cancel and dismiss.

Dropping a file collapses the notch to the uploading pill in `notch3-shell.tsx`
(upload icon and "Uploading..." text, percentage, Stop button). It reuses the
recording pill's width and height, so only the shared silhouette transition
applies.

| Part | What moves | Timing |
|---|---|---|
| Uploading icon and text | `mask-position` sweep, infinite (`.n3-upload-shimmer`) | `--dur-notch-shimmer`, linear. Runs only while uploading |
| Percentage | none | text updates, no transition |

### 4.2.1 Collapsed notch "complete" animation (`components/notch3/notch-complete.tsx`)

Reusable. Render `<NotchComplete label="..." />` inside the collapsed pill when a
background task finishes (upload, save, sync), then close the notch after
`NOTCH_COMPLETE_DURATION_MS`. Colour is `text-success`. `label` is the
accessible name.

Phosphor's `CheckCircle` is one shape, so two copies of it are masked into a ring
and a check, animated separately.

| Step | What moves | Timing |
|---|---|---|
| 1. Ring | `.n3-success-ring`: scale 0.5 to 1, fade in | `--dur-notch-check-ring`, back out |
| 2. Check | `.n3-success-check`: rises from below, overshoots to 1.25, settles | `--dur-notch-check-bubble`, back out, after `--dur-notch-check-delay` |
| 3. Hold | static | `--dur-notch-check-hold` |
| 4. Fade out | `.n3-success-out`: whole pill content `opacity` to 0 | `--dur-base`, standard |

JS mirrors in `lib/motion.ts`: `NOTCH_CHECK_RING_MS`, `NOTCH_CHECK_BUBBLE_MS`,
`NOTCH_CHECK_DELAY_MS`, `NOTCH_CHECK_HOLD_MS`. The hold and fade durations drive
the close timer, so change them in both places in the same commit.

### 4.3 Notch icon entrances (`app/globals.css`)

Each is a named keyframe plus a class. Read the keyframes in `globals.css` for
the exact steps.

| Class | Effect | Duration, easing |
|---|---|---|
| `.n3-bell-pop` | scale 0.4 to 1.18 to 0.94 to 1, fade in | 260ms, back out |
| `.n3-bell-ring` | rotate swing, decaying from 18deg | 520ms, ease in-out, 220ms delay |
| `.n3-sound-line-left`, `-right` | slide and scale in, then fade out | 640ms, ease out, 160ms delay |
| `.n3-calendar-drop` | drop in with rotation and a settle bounce | 560ms, ease out |
| `.n3-task-stamp`, `.n3-chat-stamp` | rise with overshoot and settle | 420ms, back out |
| `notch-icon-fade-in` (keyframe only) | scale 0.6 to 1.15 to 1, fade in | 200ms, back out. Reduced-motion replacement |

### 4.4 Chat and layout (`app/page.tsx`)

| Part | What moves | Timing |
|---|---|---|
| Landing to chat input move | overlay `bottom` | `CHAT_MOVE_MS` (550ms), ease out expo |
| Overlay input fade | `opacity` | `CHAT_OVERLAY_FADE_MS` (500ms), standard |
| Chat content fade | `opacity` | `CHAT_FADE_MS` (400ms), standard |
| Chat content reveal | `opacity` | `--dur-chat-reveal` (350ms), standard |
| Chat and workspace panels | `flex` | `--dur-panel-resize`, ease out expo |
| Collapsed chat body | `opacity` | `--dur-base`, ease out |
| Input shadow | `box-shadow` | `CHAT_MOVE_MS - 250` ms |
| Work panel width and similar panels | `max-width` | `--dur-panel-resize`, ease out expo |

The move sequence uses two nested `requestAnimationFrame` calls to start the
transition after layout. They run once per move and stop.

Chat scrolling: the chat follows new messages with a smooth scroll, and a
`ResizeObserver` on the message column keeps it pinned to the bottom while
content grows. Scrolling up unpins it. See open issues below.

### 4.5 Text and status

| Part | What moves | Timing |
|---|---|---|
| Animated placeholder (`components/animated-placeholder.tsx`) | rolls up and fades out, then next prompt fades in | 8s hold, then `--dur-placeholder-roll` out and in. Runs on timers |
| Thinking shimmer (`.thinking-shimmer-text`) | `background-position` sweep | 2.8s linear, infinite |
| Thinking text (`components/chat/thinking-text.tsx`) | rotating status line, fade and shift | `--dur-thinking-text`, `setInterval` cycle |
| Thinking dots | `fill` | `--dur-thinking-dot` |
| Chat FAB ring (`.fab-ring-trigger`) | `scale` 0.85 to 1.65, fade out, on hover | 900ms, ease out, once |

The placeholder, shimmer and thinking text loop. Stop them when their component
unmounts or is offscreen.

### 4.6 Tabbed list (`components/ui/tabbed-list.tsx`)

Used by the email and task inbox blocks.

| Part | Property | Timing |
|---|---|---|
| Active indicator | `left`, `width` | `--dur-tabs-indicator`, ease out expo. Fast start, soft landing, no overshoot |
| Tab label | `color` | Tailwind default transition (`--dur-hover`) |
| Panel content | none | instant swap, no fade or slide |
| Panel height | none | fixed. Hidden clones of every tab are measured on mount and the tallest sets `min-height`, so switching tabs never shifts the card |

**Base UI dependency.** The indicator is positioned by two CSS variables,
`--active-tab-left` and `--active-tab-width`. Base UI's `Tabs.Indicator` sets
them at runtime on the indicator element when the selected tab changes. They are
not defined in our CSS. To rebuild this with another tab library, measure the
active tab's `offsetLeft` and `offsetWidth` and supply the same two values.

### 4.7 Generic UI

Buttons, rows, menu items and toggles use `transition-colors`, which follows
`--dur-hover`. Dialogs, sheets, popovers, selects, dropdowns, hover cards and
tooltips use the Tailwind animate utilities (`animate-in`, `fade-in-0`,
`zoom-in-95`, `slide-in-from-*`) with their library durations. These
(including `duration-100`, `duration-150`, `duration-200`, `duration-300` in
`components/ui/*`, `message-toolbar.tsx` and `adaptive-card-renderer.tsx`) are
documented but not tokenised.

---

## 5. Remaining hard-coded values

Intentionally left as literals:

- Icon keyframe durations in section 4.3 and the FAB ring and shimmer (900ms,
  2.8s). Each is choreographed per animation.
- Tailwind animate utilities and `duration-*` classes in `components/ui/*`,
  `message-toolbar.tsx` and `adaptive-card-renderer.tsx`.
- `components/ui/progress.tsx`: duration passed in as a prop with `ease-in-out`.
- The 8s placeholder hold and 1.2s upload success linger, which are timings
  rather than animations.

Anything else added later should use a token.

---

## 6. Reduced motion

`app/globals.css` handles these under `prefers-reduced-motion: reduce`:

- Spring grow and shrink collapse to a plain `--dur-fast` ease, with no
  overshoot.
- The bell, calendar, task, chat and sound-line animations are replaced by
  `notch-icon-fade-in`.
- `--dur-panel-resize`, `--dur-tabs-indicator`, `--dur-placeholder-roll`,
  `--dur-thinking-text` and `--dur-chat-reveal` drop to `--dur-fast`, so the
  chat and workspace `flex` moves, the tab indicator, the placeholder and the
  thinking text become near-instant.
- The thinking shimmer, the uploading-pill shimmer and the FAB ring stop.
- The notch "complete" ring and check are replaced by `notch-icon-fade-in`. The
  hold and fade still run, so the check stays visible for the same time.

Not covered: the JS-timed chat landing sequence (`CHAT_MOVE_MS`, `CHAT_FADE_MS`,
`CHAT_OVERLAY_FADE_MS`) still runs at full length, because timers sequence it.
It would need a `matchMedia` check to shorten.

Never rely on motion alone to convey state. Pair it with text or an icon
change.

---

## 7. Avoid

- New hard-coded `ms` or `cubic-bezier(...)` values in components.
- Bounce on anything that closes or dismisses.
- Animating layout properties outside the cases in section 3.
- Infinite animations or idle timers that keep running while the notch is
  hidden.
- A single transition longer than about 800ms, other than progress.
- Several attention-grabbing animations at once. One focal motion at a time.

---

## 8. Open issues

- **Chat scroll with the email inbox card.** The chat did not always scroll
  fully to the newest message after "show email inbox". Not reproduced in a
  browser, so the cause is unconfirmed. Mitigations in place: a
  `ResizeObserver` keeps the chat pinned while content grows, the scroll is
  re-checked at 250, 600 and 1000ms after each message, and the tabbed list now
  re-measures its panel height when its width changes or fonts load. If it still
  stops short, check whether `scrollHeight` is stale when the smooth scroll
  starts, or scroll a bottom sentinel element into view instead.
