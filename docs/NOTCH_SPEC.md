# Notch spec

Behaviour of the notch component: a pill anchored to the top centre of the
viewport that peeks, expands into a panel with navigation, and doubles as a
file drop zone.

All timings, springs and easings come from `docs/MOTION.md` (the tokens).
Refer to them by name. Do not restate the numbers in code.

**Provenance tags**
- **[V]** verified in the reference source (Louis-CFM/coucou, MIT licence)
- **[S]** taken from the reference's Swift build
- **[N]** new requirement for this project, not in the reference
- **[?]** unverified: choose a sensible default, expose it as a named config
  constant at the top of the module, and list it in your plan

Keep a `THIRD_PARTY_NOTICES` entry crediting the MIT licence for adapted logic.
Do not reproduce the reference's character, name, icon, sounds or media.

---

## 1. Shell and geometry

1. Fixed, anchored to the top centre of the viewport, flush with the top edge,
   horizontally centred with `translateX(-50%)`. Only the bottom corners are
   rounded. [V]
2. Three modes: `hidden`, `compact` (peek), `expanded`. Target size is a
   function of (mode, view). Every view declares its own fixed width and
   height. [V]
3. Width, height and corner radius animate independently. The expanded corner
   radius is larger than the compact one. [V]
4. Growing uses `spring-grow`. Shrinking uses `curve-shrink`. When switching
   views inside the expanded panel, compare heights: new view taller or equal
   uses the spring, shorter uses the curve. [V]
5. The overlay wrapper is `pointer-events: none`. Only the pill and panel
   accept pointer events, so the page underneath stays fully usable. [N]
6. Pointer hit test: the island rectangle plus a 14px margin counts as
   "inside". [V]
7. Mount through a portal at the document root. Client-only: no `window`
   access during render. [N]
8. No layout shift on the page in any mode. [N]

### Hidden mode [V]

- The island retracts fully. After about 420ms, the interactive area shrinks to
  a thin "wake strip" along the top edge. This is the only hit target.
- While hidden: no timers, no `requestAnimationFrame`, no polling.
- Pointer entering the wake strip triggers the peek.

### Screens without a physical notch [N]

A web page has no notch. The gap between the left and right header groups is
visual only. Optional: inverted corner curves where the pill meets the top
edge. The reference's prototype HTML (`design/prototype/notch-buddy.html`) has
the shape, but do not depend on it.

---

## 2. State machine

A pure TypeScript module with no React or DOM imports, wrapped by a thin React
hook or provider. [N]

States: `hidden`, `compact`, `expanded`.

| Event | Transition |
|---|---|
| Pointer enters wake strip | `hidden` to `compact` (peek) |
| Click on compact | `compact` to `expanded` |
| Pointer enters compact (optional, config) | `compact` to `expanded` (open on hover) |
| Pointer leaves while expanded | start inactivity countdown, then `expanded` to `compact` |
| Pointer leaves while compact | start long idle countdown, then `compact` to `hidden` |
| Pointer re-enters | cancel any countdown |
| Escape | close, unless held open |
| External open request (e.g. a file drag) | force `expanded` |

Rules
- A "held open" predicate suppresses all closing. It is true while a file is
  being dragged over, while an upload is in progress, and while the user has
  pinned the notch. [V]
- A click on the island marks it as user-opened, so a hover-opened island stops
  auto-closing like an ordinary open one. [V]
- Forced opens and pins must cancel pending timers first. [V]
- Inactivity delay (expanded to compact): configurable. [?]
- Long idle delay (compact to hidden): about 60s in the Swift build. [S] [?]
- Optional: expose the remaining countdown so the UI can draw a thin
  progress bar. [V]

---

## 3. Header navigation and content [N]

A header row inside the expanded panel, with an empty gap in the centre
between two groups.

**Left group**, horizontal icon buttons, in this order:
1. Recent sessions (history icon)
2. Tasks
3. Notifications (with a slot for an unread badge)
4. Apps

**Right group**, horizontal, in this order:
1. Info
2. Settings
3. User avatar: circular. Use the app's existing auth session if there is one,
   otherwise initials or a placeholder. Clickable.

**Content area**: empty. One placeholder component per item (Recent, Tasks,
Notifications, Apps, Info, Settings, Profile), each showing only a title and
"Content goes here".

Behaviour
- Selecting an item swaps the content with the view-swap rule from section 1.
  The selected icon button shows a clear selected state.
- A single `NAV_ITEMS` config array is the source of truth: `id`, `label`,
  `icon`, `component`, `position` (`left` or `right`). Adding an item later is
  one change.
- Use the project's existing icon library. If it is lucide-react, the matching
  icons are `History`, `ListChecks`, `Bell`, `LayoutGrid`, `Info`, `Settings`.
- Keep the header visible while the drop sequence runs. The sequence draws
  underneath it. [V]

---

## 4. Drop flow lifecycle

Views owned by the flow: `upload` (waiting), `uploading`, `choose`. [V]

Browser events [N]
- Listen on `window` for `dragenter`, `dragover`, `dragleave`, `drop`.
- React only when `dataTransfer.types` includes `"Files"`. Text and link drags
  must be ignored.
- Use a depth counter for enter and leave, so child elements do not cause
  flicker.
- Call `preventDefault` on `dragover` and `drop`. A file dropped anywhere on the
  page must never navigate the browser to it.
- Provide a click-to-browse file input as a keyboard-accessible and touch
  fallback. Drag and drop does not exist on touch devices.

Lifecycle
1. **Drag enter.** Activate the sequence engine first, then expand into the
   `upload` view. Order matters so the first frame is correct. [V]
2. **Drag over.** Feed island-local cursor coordinates to the engine on every
   event (`clientX`, `clientY` minus the island's rectangle origin). [V]
3. **Drag leave.** Relax the visuals but do not collapse. The drag is still
   alive. [V]
4. **Drop.** Start the post-drop timeline immediately. Ingesting the file
   (validation, upload) runs in the background and must never block the
   animation. [V]
5. **Failure.** Stop the sequence, show a short note view with the error for
   about 2.4s, then return to the default view. [V]
6. **Cancel** on the choose card: forget the file, return to the default
   view. [V]
7. Leaving the three drop views, or collapsing the notch, stops the engine. [V]

Layering [V]
- A canvas (or absolutely positioned layer) sits under the header.
- The normal view container is hidden while the sequence runs.

---

## 5. Drop choreography

Replaces the reference's character with a neutral **orb** (a circle or file
icon, 62px diameter at rest). Drop the mouth, eyes, look-at and emotes.
Everything else below is kept. [V]

### Engine design
- A pure module, no DOM. Inputs: cursor position and drop time. Output: a
  frame object each tick. A separate renderer applies it.
- Integrate springs in fixed 1/240s sub-steps. Clamp stalls longer than 2s.
  Details in `docs/MOTION.md` section 5.
- Designed on a 640 x 176 island. Drop card: x 10, y 42, 620 x 124, corner
  radius 20. Scale proportionally if your island differs.

### Before the drop
- The orb rests at x 140, y 104.
- It follows the cursor horizontally, clamped to x 60 to 580, using the
  `follow` preset.
- It **locks on** when within 60px of the cursor and the cursor speed is below
  180px/s: switch to `follow-locked` and do a 5px hop over 0.15s. It unlocks
  beyond 90px.
- Tilt = horizontal velocity x 0.0015, clamped to +/- 0.18 rad, smoothed.
- The card gets a subtle green wash (about 0.22 alpha) while a file is over
  it.
- Entry: the orb morphs in with `ease-back-out` over about 0.38s.

### After the drop, seconds since the drop

| Time | What happens |
|---|---|
| +0.00 to +0.08 | Squash: scaleY 1 to 0.92, scaleX 1 to 1.06 |
| +0.08 to +0.38 | Absorb: the file visibly gets pulled into the orb (clip or scale it down into the orb). scaleY 0.92 to 1.06, scaleX 1.06 to 0.97 |
| +0.38 to +0.65 | Squish: scaleY 1.06 to 0.82 (first 70ms), then 1.10 (by 200ms), then 1.0. scaleX 0.97 to 1.14 to 0.95 to 1.0 |
| +0.65 to +0.93 | Wobble: scaleY = 1 - 0.05 sin, scaleX = 1 + 0.03 sin, period 0.14s |
| +0.93 to +1.28 | Shrink to a 14px dot while travelling to the bar start (x 46, y 118), `ease-in-out-cubic`, with a stretch pulse (scaleY +0.12 sin, scaleX -0.06 sin) |
| +1.05, over 0.25 | Progress bar fades in |
| +1.30 onwards | Progress: dot travels x 46 to 520 along y 118 for the upload duration (default 2.4s), stretching with speed (scaleX up to 1.25, scaleY down to 0.85) |
| At completion | Dot hops up 8px over 0.2s, flash pulse (0.3s sine), check mark pops in with `ease-back-out` (0.25s), green wash peaks then fades over about 0.6s |
| +0.25 to +0.70 after completion | Dot grows back to 62px at the choose position (x 60, y 101) with `ease-back-out`. Bar fades out. Choose card fades in |
| About 1.0s after completion | Switch to the `choose` view |

Optional: a tick sound every 10% of progress, a chime at completion.

### Progress curve (fraction of duration to fraction of bar) [V]

| Duration | Bar | Easing |
|---|---|---|
| 0 to 0.40 | 0 to 0.60 | `out` cubic |
| 0.40 to 0.85 | 0.60 to 0.92 | `inOut` cubic |
| 0.85 to 1.00 | 0.92 to 1.00 | `in` cubic |

### Adapting to real uploads [N]
The reference fakes progress on a timer. For a real upload:
- Drive the dot from real upload progress, eased toward the target each frame.
- Enforce a minimum duration so very fast uploads still show the choreography.
- Hold at 92% until the server confirms.
- On failure, the dot shakes and the flow enters the note view (lifecycle
  step 5).

---

## 6. Attachments and uploading [N]

- Observable attachment list. Each item: name, size, type icon, optional image
  thumbnail via `URL.createObjectURL` (revoke on removal), status (`queued`,
  `uploading` with progress, `done`, `error`), retry, remove.
- Handle multiple files, duplicates and name collisions.
- Directories: choose a behaviour (reject with a message, or zip) and tell the
  user which you picked. [?]
- Validation: configurable max size and allowed types, with clear error
  messages.
- Show the attachment list as a strip above or below the content area when it
  has items.
- Put uploading behind an adapter interface, for example
  `UploadClient.upload(file, onProgress, signal)`, so the backend can be
  swapped. Ship a default implementation that posts to a Next.js route handler
  using `XMLHttpRequest` for progress, plus a stub route handler. Support
  cancellation with `AbortController`. Do not assume a storage provider.

---

## 7. Accessibility and input [N]

- Header is a toolbar with arrow-key navigation. Buttons have `aria-label`s
  and tooltips.
- Panel exposes `aria-expanded`. Escape closes. Focus returns to the trigger
  on close.
- Shortcuts: Cmd/Ctrl + Left and Right cycle items, Cmd/Ctrl + 1 to 7 jump.
  Make them easy to disable if they clash with the app's own.
- Respect `prefers-reduced-motion` per `docs/MOTION.md` section 7.
- Never convey state by motion alone.

---

## 8. Performance

- Zero timers, `requestAnimationFrame` calls or listeners doing work while
  hidden, apart from the wake strip's pointer event. [V]
- Start the frame loop only when something animates. Stop it when everything
  settles. [V]
- Animate `transform` and `opacity` for everything except the notch's own
  silhouette (see `docs/MOTION.md` section 4). [V]

---

## 9. Not found in the reference: your decisions

| Item | Default to use |
|---|---|
| Inactivity delay, expanded to compact | 4s |
| Long idle delay, compact to hidden | 60s |
| Open on hover | off |
| Per-view widths and heights | compact 180 x 36, expanded 640 x 176 for the drop views, taller for content views |
| Corner radii | compact 12px, expanded 24px |
| Max upload size, allowed types | set per project |
| Directory handling | reject with a clear message |

These are placeholders. Tune them by eye.

---

## 10. Acceptance checklist

- [ ] Hidden notch costs nothing: no timers or frame callbacks (check in
      DevTools Performance).
- [ ] Hover, click, leave and Escape produce the transitions in section 2.
- [ ] Growing uses the spring, shrinking uses the curve, including view swaps.
- [ ] Header order matches section 3. Every item opens its placeholder.
- [ ] Dragging a file in expands the notch. Dragging out does not collapse it.
      Dropping starts the choreography.
- [ ] Dragging text or a link does nothing. Dropping a file outside the notch
      does not navigate the browser.
- [ ] Several files, duplicates, oversize and wrong-type files are handled.
- [ ] Failure path shows the note view and recovers.
- [ ] Works with keyboard only, including the file picker fallback.
- [ ] Reduced motion mode behaves per `docs/MOTION.md` section 7.
- [ ] No layout shift in any mode, at desktop and mobile widths.
