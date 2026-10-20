# Motion

How things move in this app. Every animation uses the tokens below. Do not
hard-code durations or easings in components.

Provenance tags: **[V]** verified in the reference source (Louis-CFM/coucou,
MIT), **[S]** taken from the reference's Swift build, **[D]** a default chosen
here, change freely.

---

## 1. Principles

1. **Grow with a spring, shrink with a curve.** Things that open or enlarge
   overshoot slightly and settle. Things that close or reduce glide out
   quickly with no bounce. [V]
2. **Motion explains state changes.** If an animation does not show where
   something came from or went to, remove it.
3. **Interruptible.** A user can reverse any transition mid-flight and the
   result must still look intentional.
4. **Nothing runs when nothing is visible.** No timers, no
   `requestAnimationFrame`, no polling while the notch is hidden. [V]
5. **Reduced motion is a first-class mode**, not an afterthought (section 7).

---

## 2. Tokens

| Token | Value | Use | Tag |
|---|---|---|---|
| `spring-grow` | response 0.5s, damping ratio 0.72 (about 800ms to settle, 3.8% overshoot) | Anything that opens, enlarges, or swaps to a taller view | [S] |
| `curve-shrink` | `cubic-bezier(0.45, 0, 0.2, 1)`, 340ms | Anything that closes, reduces, or swaps to a shorter view | [S] |
| `ease-out-cubic` | `cubic-bezier(0.215, 0.61, 0.355, 1)` | Fades in, reveals, bar fill | [V] |
| `ease-in-cubic` | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | Exits, final push of the progress curve | [V] |
| `ease-in-out-cubic` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | Travel between two resting positions | [V] |
| `ease-back-out` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Pop-ins with a small overshoot (check mark, orb regrowing) | [V] |
| `dur-fast` | 120ms | Hover, press, selected state | [D] |
| `dur-base` | 200ms | Fades, small reveals | [D] |
| `dur-slow` | 340ms | Matches `curve-shrink` | [S] |

### CSS custom properties

```css
:root {
  /* spring-grow, sampled from the spring equation. Settles in 800ms. */
  --ease-spring-grow: linear(0, 0.0286, 0.0998, 0.197, 0.307, 0.4202, 0.5295,
    0.6305, 0.7202, 0.7974, 0.8618, 0.9139, 0.9546, 0.9854, 1.0076, 1.0226,
    1.0318, 1.0366, 1.0379, 1.0369, 1.0342, 1.0305, 1.0263, 1.0221, 1.0179,
    1.0141, 1.0107, 1.0077, 1.0053, 1.0033, 1.0017, 1.0006, 0.9997, 0.9992,
    0.9988, 0.9986, 0.9986, 0.9986, 0.9987, 0.9988, 1);
  --dur-spring-grow: 800ms;

  --ease-shrink: cubic-bezier(0.45, 0, 0.2, 1);
  --dur-shrink: 340ms;

  --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
  --ease-in-cubic: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-back-out: cubic-bezier(0.34, 1.56, 0.64, 1);

  --dur-fast: 120ms;
  --dur-base: 200ms;
}

/* Browsers without linear(): fall back to a close bezier. */
@supports not (transition-timing-function: linear(0, 1)) {
  :root { --ease-spring-grow: cubic-bezier(0.34, 1.3, 0.64, 1); }
}
```

### TypeScript

Create `lib/motion.ts` exporting the same values as typed constants
(`SPRING_GROW = { response: 0.5, damping: 0.72 }`, `SHRINK_MS = 340`, the
bezier strings, and the duration scale). JS-driven motion (section 5) imports
from it. The CSS custom properties above and `lib/motion.ts` must never
disagree. If you change one, change the other in the same commit.

### Regenerating the spring curve

Integrate `a = k * (1 - x) - c * v` with `k = (2 * PI / response)^2` and
`c = 2 * damping * sqrt(k)`, mass 1, from `x = 0, v = 0`. Use a small fixed
step (1/2400s). Find the last time `|x - 1| > 0.001` (the settle time), then
sample 40 evenly spaced points across that time. Force the first sample to 0
and the last to 1. Settle time becomes `--dur-spring-grow`.

---

## 3. Which tool for which job

| Situation | Approach |
|---|---|
| Size, radius, position changes between known states | CSS `transition` with the tokens above |
| View swap inside the expanded notch | CSS: compare the new view's height to the old one. Taller or equal uses `spring-grow`, shorter uses `curve-shrink`. [V] |
| Hover, focus, selected state | CSS, `dur-fast` + `ease-out-cubic` |
| Anything that follows the pointer, or depends on velocity | JS `requestAnimationFrame` loop (section 5) |
| Progress tied to a real upload | JS, eased toward the real value each frame |

Do not add an animation library unless CSS plus the section 5 loop cannot meet
a written requirement. If you believe one is needed, say why before adding it.

### Known limit of CSS springs

A CSS transition that is retargeted mid-flight keeps position but loses
velocity, so reversing an expand can look slightly abrupt. Accept this. It is
the one visible difference from the reference. Revisit only if it bothers
people in practice.

---

## 4. Layout-affecting properties (read before copying the pattern)

Animate `transform` and `opacity` wherever possible. They are cheap.

**Exception, deliberate:** the notch animates `width`, `height` and
`border-radius`, because its silhouette is the effect. This is acceptable
because it is one fixed-position element with fixed target sizes per view, so
nothing reflows around it. Do not copy this pattern to list items, cards or
anything in normal document flow. Animate those with `transform` and
`opacity`.

Also required for the notch:

- Use `will-change: width, height` only while a transition is running, then
  remove it.
- Mount through a portal at the document root. A parent with `transform`,
  `filter` or `contain` breaks fixed positioning.
- Keep per-view heights as fixed numbers. Avoid transitioning to `auto`.

---

## 5. JS-driven motion (the drop sequence)

Used only where CSS cannot express the behaviour. [V]

- **Pure engine.** A TypeScript module with no DOM access. Inputs: cursor
  position and drop time. Output: a frame object each tick. A separate render
  layer applies the frame via `transform` and `opacity` (or draws to a canvas).
- **Fixed sub-step.** Integrate springs in 1/240s steps regardless of display
  refresh rate. If more than 2s has passed since the last frame (background
  tab, dragged window), clamp rather than simulate the gap.
- **Frame loop.** Start `requestAnimationFrame` only when something is
  animating. Clamp `dt` to 50ms. Stop the loop as soon as everything settles.
- **Spring step.** `k = (2 * PI / response)^2`, `c = 2 * damping * sqrt(k)`,
  `a = k * (target - value) - c * velocity`, then update velocity, then value.

| Preset | Response | Damping | Use |
|---|---|---|---|
| `follow` | 0.35 | 0.70 | Follower tracking the cursor |
| `follow-locked` | 0.18 | 0.75 | Follower once locked on |
| `quick` | 0.25 | 0.60 | Any small value that needs a fast, slightly bouncy settle (the reference used it for the character's mouth, which you are not building) |

All three are [V]. Full choreography is in `docs/NOTCH_SPEC.md`.

---

## 6. Easing formulas (for JS use) [V]

```
out(t)     = 1 - (1 - t)^3
in(t)      = t^3
inOut(t)   = t < 0.5 ? 4 * t^3 : 1 - (-2t + 2)^3 / 2
backOut(t) = 1 + c3 * (t - 1)^3 + c1 * (t - 1)^2    with c1 = 1.70158, c3 = c1 + 1
lerp(a,b,t) = a + (b - a) * t
seg(t,a,b)  = clamp((t - a) / (b - a), 0, 1)
```

---

## 7. Reduced motion

When `prefers-reduced-motion: reduce`:

- Replace every spring, overshoot, squeeze, tilt and hop with a plain
  `dur-base` opacity fade.
- The notch still changes size between states, but with `curve-shrink` at
  `dur-fast` and no overshoot.
- The drop sequence collapses to its states: waiting, uploading (a plain
  determinate progress bar), done, choose. No follower, no wobble, no flash.
- Stop all looping motion. Never rely on motion alone to convey state: pair it
  with text or an icon change.

---

## 8. Avoid

- Hard-coded `ms` or `cubic-bezier(...)` values in components.
- Bounce on anything that closes or dismisses.
- Animating layout properties on anything other than the notch.
- Loops (`infinite` animations, idle `requestAnimationFrame`) that keep running
  while the notch is hidden. [V]
- Motion longer than about 800ms for a single transition, except progress.
- Stacking several attention-grabbing animations at once. One focal motion at
  a time.
