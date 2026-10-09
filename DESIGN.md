---
typography:
  display:
    font: "Geist"
    weight: 600
    size: "40px"
    line-height: "1.05"
    letter-spacing: "-0.03em"
    use: "Hero headlines, major page titles"
  heading-1:
    font: "Geist"
    weight: 600
    size: "32px"
    line-height: "1.1"
    letter-spacing: "-0.025em"
    use: "Page-level headings"
  heading-2:
    font: "Geist"
    weight: 600
    size: "24px"
    line-height: "1.2"
    letter-spacing: "-0.02em"
    use: "Section headings"
  heading-3:
    font: "Geist"
    weight: 500
    size: "20px"
    line-height: "1.3"
    letter-spacing: "-0.015em"
    use: "Subsection headings, card titles"
  body:
    font: "Geist"
    weight: 400
    size: "16px"
    line-height: "1.5"
    use: "Primary body copy, descriptions"
  small:
    font: "Geist"
    weight: 400
    size: "14px"
    line-height: "1.5"
    use: "Default UI text, form fields, buttons, list items"
  caption:
    font: "Geist"
    weight: 500
    size: "12px"
    line-height: "1.4"
    letter-spacing: "0.02em"
    use: "Labels, captions, metadata, badges"
  code:
    font: "Geist Mono"
    weight: 400
    size: "13px"
    line-height: "1.5"
    use: "Code blocks, inline code, identifiers, keyboard shortcuts"

rounded:
  none: "0px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  3xl: "22px"
  4xl: "26px"
  full: "9999px"

spacing:
  base: "4px"
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"

shadows:
  sm-light: "0 1px 2px oklch(0.25 0.03 255 / 0.06), 0 1px 1px oklch(0.25 0.03 255 / 0.04)"
  md-light: "0 4px 12px -2px oklch(0.25 0.03 255 / 0.08), 0 2px 6px -2px oklch(0.25 0.03 255 / 0.06)"
  lg-light: "0 14px 32px -8px oklch(0.25 0.05 255 / 0.14), 0 4px 10px -4px oklch(0.25 0.05 255 / 0.08)"
  sm-dark: "0 1px 2px oklch(0 0 0 / 0.5)"
  md-dark: "0 4px 14px -4px oklch(0 0 0 / 0.55), 0 1px 2px oklch(0 0 0 / 0.4)"
  lg-dark: "0 14px 36px -10px oklch(0 0 0 / 0.66), inset 0 1px 0 oklch(1 0 0 / 0.05)"

components:
  accordion:
    textColor: "var(--muted-foreground)"
    rounded: "{rounded.lg}"
    padding: "{spacing.sm}"
  alert:
    backgroundColor: "var(--card)"
    textColor: "var(--card-foreground)"
    rounded: "{rounded.lg}"
    padding: "{spacing.sm}"
  alert-dialog:
    backgroundColor: "var(--popover)"
    textColor: "var(--popover-foreground)"
    rounded: "{rounded.xl}"
    padding: "{spacing.md}"
  avatar:
    backgroundColor: "var(--muted)"
    textColor: "var(--muted-foreground)"
    rounded: "{rounded.full}"
    size: "32px"
  badge:
    backgroundColor: "var(--primary)"
    textColor: "var(--primary-foreground)"
    rounded: "{rounded.4xl}"
    height: "20px"
    padding: "{spacing.sm}"
    typography: "{typography.caption}"
  breadcrumb:
    textColor: "var(--muted-foreground)"
    typography: "{typography.small}"
  button-primary:
    backgroundColor: "var(--primary)"
    textColor: "var(--primary-foreground)"
    rounded: "{rounded.md}"
    height: "32px"
    padding: "{spacing.sm}"
    typography: "{typography.small}"
  button-secondary:
    backgroundColor: "var(--secondary)"
    textColor: "var(--secondary-foreground)"
    rounded: "{rounded.md}"
    height: "32px"
    padding: "{spacing.sm}"
  button-ghost:
    textColor: "var(--foreground)"
    rounded: "{rounded.md}"
    height: "32px"
    padding: "{spacing.sm}"
  button-ghost-hover:
    backgroundColor: "var(--accent)"
    textColor: "var(--accent-foreground)"
  button-destructive:
    backgroundColor: "var(--destructive)"
    textColor: "var(--destructive-foreground)"
    rounded: "{rounded.md}"
    height: "32px"
    padding: "{spacing.sm}"
  card:
    backgroundColor: "var(--card)"
    textColor: "var(--card-foreground)"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  checkbox:
    backgroundColor: "var(--primary)"
    textColor: "var(--primary-foreground)"
    rounded: "4px"
    size: "16px"
  command:
    backgroundColor: "var(--popover)"
    textColor: "var(--popover-foreground)"
    rounded: "{rounded.xl}"
  context-menu:
    backgroundColor: "var(--popover)"
    textColor: "var(--popover-foreground)"
    rounded: "{rounded.lg}"
  dialog:
    backgroundColor: "var(--popover)"
    textColor: "var(--popover-foreground)"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  drawer:
    backgroundColor: "var(--popover)"
    textColor: "var(--popover-foreground)"
    rounded: "{rounded.xl}"
  dropdown-menu:
    backgroundColor: "var(--popover)"
    textColor: "var(--popover-foreground)"
    rounded: "{rounded.lg}"
  empty:
    backgroundColor: "var(--muted)"
    textColor: "var(--muted-foreground)"
    rounded: "{rounded.xl}"
  hover-card:
    backgroundColor: "var(--popover)"
    textColor: "var(--popover-foreground)"
    rounded: "{rounded.lg}"
    width: "256px"
  input:
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "{spacing.sm}"
    typography: "{typography.small}"
  item:
    backgroundColor: "var(--muted)"
    textColor: "var(--muted-foreground)"
    rounded: "{rounded.lg}"
    padding: "{spacing.sm}"
  kbd:
    backgroundColor: "var(--muted)"
    textColor: "var(--muted-foreground)"
    rounded: "{rounded.sm}"
    height: "20px"
    typography: "{typography.caption}"
  menubar:
    backgroundColor: "var(--muted)"
    textColor: "var(--muted-foreground)"
    rounded: "{rounded.lg}"
    height: "32px"
  navigation-menu:
    backgroundColor: "var(--popover)"
    textColor: "var(--popover-foreground)"
    rounded: "{rounded.lg}"
  popover:
    backgroundColor: "var(--popover)"
    textColor: "var(--popover-foreground)"
    rounded: "{rounded.lg}"
    padding: "{spacing.sm}"
    width: "288px"
  progress:
    backgroundColor: "var(--muted)"
    rounded: "{rounded.full}"
    height: "4px"
  radio-group:
    backgroundColor: "var(--primary)"
    rounded: "{rounded.full}"
    size: "16px"
  select:
    backgroundColor: "var(--popover)"
    textColor: "var(--popover-foreground)"
    rounded: "{rounded.lg}"
    height: "32px"
  separator:
    backgroundColor: "var(--border)"
    height: "1px"
  sheet:
    backgroundColor: "var(--popover)"
    textColor: "var(--popover-foreground)"
    rounded: "{rounded.xl}"
  sidebar-item:
    backgroundColor: "var(--sidebar)"
    textColor: "var(--sidebar-foreground)"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  sidebar-item-active:
    backgroundColor: "var(--sidebar-accent)"
    textColor: "var(--sidebar-accent-foreground)"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  sidebar-item-hover:
    backgroundColor: "var(--sidebar-accent)"
    textColor: "var(--sidebar-accent-foreground)"
  skeleton:
    backgroundColor: "var(--muted)"
    rounded: "{rounded.md}"
  slider:
    backgroundColor: "var(--primary)"
    rounded: "{rounded.full}"
    height: "4px"
  spinner:
    size: "16px"
  switch:
    backgroundColor: "var(--primary)"
    rounded: "{rounded.full}"
    height: "18px"
    width: "32px"
  tab:
    backgroundColor: "var(--accent)"
    textColor: "var(--accent-foreground)"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
    typography: "{typography.small}"
  table:
    textColor: "var(--muted-foreground)"
    height: "40px"
  textarea:
    rounded: "{rounded.lg}"
    padding: "{spacing.sm}"
    typography: "{typography.small}"
  toggle:
    rounded: "{rounded.lg}"
    height: "32px"
  tooltip:
    backgroundColor: "var(--foreground)"
    textColor: "var(--background)"
    rounded: "{rounded.md}"
    padding: "{spacing.xs}"
    typography: "{typography.caption}"
---

# IX Design System — Cool Graphite

**Version:** 1.1  
**Date:** 08/10/2026

IXDS is the component and token library for IQ. It builds on the shadcn b0 preset (radix-nova style) with Tailwind CSS v4, React, and Radix UI primitives. The base theme is "Cool Graphite" — blue-shifted graphite neutrals with a confident orange accent, OKLCH perceptual colour throughout.

---

## Overview

The design system is built around three ideas:

**Shadcn parity first.** All components match the latest shadcn registry (b0/radix-nova preset). Sizes, variants, and interaction patterns are kept in sync. Extensions are clearly separated.

**Semantic tokens, not literal values.** Components reference `--primary`, `--muted`, `--accent` — never raw colour values. The entire visual language shifts by changing root variables.

**Perceptual colour.** All colour values use OKLCH (`oklch(lightness chroma hue)`). OKLCH is perceptually uniform — derived accent/muted colours feel consistent across all colour themes.

---

## Colors

### Semantic token reference

Components must always use Tailwind utility classes that resolve to CSS custom properties — never raw hex or oklch values in component files.

| Token                         | Tailwind utility                     | Use for                                                                  |
| ----------------------------- | ------------------------------------ | ------------------------------------------------------------------------ |
| `--background`                | `bg-background`                      | Page canvas — the floor of the elevation stack. Do not use as a surface. |
| `--foreground`                | `text-foreground`                    | Default body text                                                        |
| `--card`                      | `bg-card`                            | Standard card and panel surfaces                                         |
| `--card-foreground`           | `text-card-foreground`               | Text inside cards                                                        |
| `--popover`                   | `bg-popover`                         | Dropdowns, tooltips, floating surfaces                                   |
| `--popover-foreground`        | `text-popover-foreground`            | Text inside popovers                                                     |
| `--primary`                   | `bg-primary`, `text-primary`         | Brand accent, primary buttons, active states                             |
| `--primary-foreground`        | `text-primary-foreground`            | Text on primary-coloured backgrounds                                     |
| `--secondary`                 | `bg-secondary`                       | Secondary buttons, subtle surface fills                                  |
| `--secondary-foreground`      | `text-secondary-foreground`          | Text on secondary backgrounds                                            |
| `--muted`                     | `bg-muted`                           | Disabled states, subdued fills, code blocks                              |
| `--muted-foreground`          | `text-muted-foreground`              | Placeholder text, metadata, timestamps                                   |
| `--accent`                    | `bg-accent`                          | Hover highlight, selected row, active nav item                           |
| `--accent-foreground`         | `text-accent-foreground`             | Text on accent-highlighted backgrounds                                   |
| `--destructive`               | `bg-destructive`, `text-destructive` | Error states, delete/danger actions                                      |
| `--destructive-foreground`    | `text-destructive-foreground`        | Text on destructive backgrounds                                          |
| `--success`                   | `bg-success`, `text-success`         | Success states, confirmations                                            |
| `--warning`                   | `bg-warning`, `text-warning`         | Warning states, caution indicators                                       |
| `--info`                      | `bg-info`, `text-info`               | Informational callouts                                                   |
| `--border`                    | `border-border`                      | Default dividers and component outlines                                  |
| `--border-subtle`             | `border-border-subtle`               | Quieter hairline for inside-card dividers                                |
| `--input`                     | `border-input`                       | Form field borders                                                       |
| `--ring`                      | `ring-ring`                          | Keyboard focus rings                                                     |
| `--surface-raised`            | `bg-surface-raised`                  | Third elevation step above card                                          |
| `--surface-raised-foreground` | `text-surface-raised-foreground`     | Text on raised surfaces                                                  |
| `--chart-1` to `--chart-5`    | `bg-chart-*`, `text-chart-*`         | Data visualisation series colours                                        |
| `--file-pdf`                  | `text-file-pdf`, `bg-file-pdf`       | File-type icon: PDF                                                      |
| `--file-document`             | `text-file-document`                 | File-type icon: Word documents, plain text, Markdown                     |
| `--file-spreadsheet`          | `text-file-spreadsheet`              | File-type icon: Excel, CSV                                               |
| `--file-image`                | `text-file-image`                    | File-type icon: raster and vector images                                 |
| `--file-slide`                | `text-file-slide`                    | File-type icon: PowerPoint presentations                                 |
| `--file-code`                 | `text-file-code`                     | File-type icon: JSON, skill files, and other code formats                |
| `--file-archive`              | `text-file-archive`                  | File-type icon: ZIP and other archive formats                            |
| `--file-video`                | `text-file-video`                    | File-type icon: MP4, MOV, AVI, and other video formats                   |
| `--file-audio`                | `text-file-audio`                    | File-type icon: MP3, WAV, M4A, and other audio formats                   |
| `--file-email`                | `text-file-email`                    | File-type icon: MSG and other email formats                              |

### Sidebar tokens

| Token                          | Tailwind utility                  | Use for                             |
| ------------------------------ | --------------------------------- | ----------------------------------- |
| `--sidebar`                    | `bg-sidebar`                      | Sidebar panel background            |
| `--sidebar-foreground`         | `text-sidebar-foreground`         | Default text inside the sidebar     |
| `--sidebar-primary`            | `bg-sidebar-primary`              | Active/selected nav item background |
| `--sidebar-primary-foreground` | `text-sidebar-primary-foreground` | Text on active nav items            |
| `--sidebar-accent`             | `bg-sidebar-accent`               | Hover state on sidebar items        |
| `--sidebar-accent-foreground`  | `text-sidebar-accent-foreground`  | Text on hovered sidebar items       |
| `--sidebar-border`             | `border-sidebar-border`           | Sidebar dividers                    |
| `--sidebar-ring`               | `ring-sidebar-ring`               | Focus ring within the sidebar       |

### Base themes

| Theme                   | Class            | Character                                                  |
| ----------------------- | ---------------- | ---------------------------------------------------------- |
| **Cool Graphite Light** | _(none / :root)_ | Blue-shifted graphite neutrals, warm surfaces              |
| **Cool Graphite Dark**  | `.dark`          | Deep graphite, lighter elevated surfaces, inset highlights |

### Accent colours

Five accent colours applied via `data-color` attribute on `:root`. They override the primary set — the base theme's neutral palette stays intact. Orange is the default (no attribute needed).

| Value    | Hue (OKLCH) | Notes                           |
| -------- | ----------- | ------------------------------- |
| `orange` | 45          | Default brand colour (baked in) |
| `blue`   | 260         |                                 |
| `violet` | 295         |                                 |
| `teal`   | 185         | Dark foreground (teal is light) |
| `rose`   | 10          |                                 |

When an accent colour is active, accent and sidebar-accent tokens are dynamically derived from `--primary` using relative colour syntax (`oklch(from var(--primary) ...)`).

---

## Typography

One typeface family — Geist — with a mono companion.

| Font           | Token                       | Use for                                                                           |
| -------------- | --------------------------- | --------------------------------------------------------------------------------- |
| **Geist**      | `font-sans`, `font-heading` | All UI text — labels, body, headings, buttons, navigation. Set globally.          |
| **Geist Mono** | `font-mono`                 | Inline code, code blocks, technical identifiers, keyboard shortcuts, data values. |

`font-heading` is aliased to `font-sans`. Both resolve to Geist.

### Type scale

| Role      | Size | Weight | Tracking | Text wrap            | Use                                   |
| --------- | ---- | ------ | -------- | -------------------- | ------------------------------------- |
| Display   | 40px | 600    | -0.03em  | `text-wrap: balance` | Hero headlines                        |
| Heading 1 | 32px | 600    | -0.025em | `text-wrap: balance` | Page headings                         |
| Heading 2 | 24px | 600    | -0.02em  | `text-wrap: balance` | Section headings                      |
| Heading 3 | 20px | 500    | -0.015em | `text-wrap: balance` | Card titles, subsection headings      |
| Body      | 16px | 400    | —        | `text-wrap: pretty`  | Primary body copy                     |
| Small     | 14px | 400    | —        | —                    | Default UI text, buttons, form fields |
| Caption   | 12px | 500    | 0.02em   | —                    | Labels, badges, metadata              |
| Code      | 13px | 400    | —        | —                    | Code, identifiers, shortcuts          |

### Line length

WCAG 2.2 SC 1.4.8 (Level AAA) recommends no more than 80 characters per line for body text (40 for CJK). This is an AAA recommendation — exceeding 80 characters is not a WCAG 2.2 AA failure — but it is a good target for long-form prose or reading-heavy layouts.

- Constrain blocks of body text to roughly `max-w-prose` (`65ch`) — comfortably within the 80-character target.
- For CJK content, aim for `max-w-[40ch]` or equivalent.
- Short UI text (labels, captions, button copy) is exempt; line-length limits apply to reading contexts, not interface chrome.

---

## Layout

All layout dimensions are multiples of the 4px base grid. Never use arbitrary pixel values for padding, margin, or gap when a grid-aligned Tailwind utility exists.

| Token | Value | Tailwind approx  |
| ----- | ----- | ---------------- |
| xs    | 4px   | `p-1`, `gap-1`   |
| sm    | 8px   | `p-2`, `gap-2`   |
| md    | 16px  | `p-4`, `gap-4`   |
| lg    | 24px  | `p-6`, `gap-6`   |
| xl    | 32px  | `p-8`, `gap-8`   |
| 2xl   | 48px  | `p-12`, `gap-12` |
| 3xl   | 64px  | `p-16`, `gap-16` |

### Breakpoints and containers

The project uses Tailwind CSS v4 defaults. No `--breakpoint-*` or `--container-*` values are overridden in the theme.

#### Viewport breakpoints (Tailwind v4 defaults)

| Name | Min width | Tailwind prefix |
| ---- | --------- | --------------- |
| sm   | 40rem (640px)  | `sm:`  |
| md   | 48rem (768px)  | `md:`  |
| lg   | 64rem (1024px) | `lg:`  |
| xl   | 80rem (1280px) | `xl:`  |
| 2xl  | 96rem (1536px) | `2xl:` |

Use viewport breakpoints only for device-level decisions (navigation changes, touch targets). Layout collapse inside blocks is driven by container queries, not viewport breakpoints.

#### Container query sizes (Tailwind v4 defaults, via `@tailwindcss/container-queries`)

| Name | Min width | Prefix |
| ---- | --------- | ------ |
| @xs  | 20rem (320px)  | `@xs:`  |
| @sm  | 24rem (384px)  | `@sm:`  |
| @md  | 28rem (448px)  | `@md:`  |
| @lg  | 32rem (512px)  | `@lg:`  |
| @xl  | 36rem (576px)  | `@xl:`  |
| @2xl | 42rem (672px)  | `@2xl:` |
| @3xl | 48rem (768px)  | `@3xl:` |
| @4xl | 56rem (896px)  | `@4xl:` |
| @5xl | 64rem (1024px) | `@5xl:` |
| @6xl | 72rem (1152px) | `@6xl:` |
| @7xl | 80rem (1280px) | `@7xl:` |

#### Page widths

No page or content max-width convention exists in the project at this time.

---

## Icons

Icons use a four-step size scale encoded as theme tokens. The default is `size-icon` (18px).

### Size tokens

| Token             | CSS variable          | Value    | Tailwind utility |
| ----------------- | --------------------- | -------- | ---------------- |
| `--size-icon-xs`  | `var(--size-icon-xs)` | 14px     | `size-icon-xs`   |
| `--size-icon-sm`  | `var(--size-icon-sm)` | 16px     | `size-icon-sm`   |
| **`--size-icon`** | `var(--size-icon)`    | **18px** | **`size-icon`**  |
| `--size-icon-lg`  | `var(--size-icon-lg)` | 20px     | `size-icon-lg`   |

### Scale by component size

Components with explicit size variants scale their icons with the control:

| Control size       | Icon token      |
| ------------------ | --------------- |
| xs / icon-xs       | `size-icon-xs`  |
| sm / icon-sm       | `size-icon-sm`  |
| **default / icon** | **`size-icon`** |
| lg / icon-lg       | `size-icon-lg`  |

### Rules

- Use `@phosphor-icons/react` exclusively — never `lucide-react` or other icon libraries.
- Always use a size token — never raw pixel values (`size-[18px]`) or generic Tailwind sizes (`size-4`) for icons.
- Do not set an explicit size class when the component's CSS already handles it via `[&_svg:not([class*='size-'])]:size-icon` — only set it when placing an icon directly in markup outside a component context.
- Alert icons use `size-icon` with `self-start translate-y-0.5` to align with the title baseline.

---

## Elevation & Depth

The elevation stack expresses depth through surface tone + theme-aware shadow tokens.

| Level         | Token              | Tailwind            | Use                                                   |
| ------------- | ------------------ | ------------------- | ----------------------------------------------------- |
| Canvas        | `--background`     | `bg-background`     | The page floor. Never use as a card or panel surface. |
| Raised        | `--card`           | `bg-card`           | Standard cards, panels, main content areas            |
| Higher raised | `--surface-raised` | `bg-surface-raised` | Stacked surfaces above card (dense layouts)           |
| Overlay       | `--popover`        | `bg-popover`        | Dropdowns, tooltips, context menus, date pickers      |
| Floating      | `--popover`        | `bg-popover`        | Modals, dialogs, sheets                               |

Shadow tokens (`shadow-sm`, `shadow-md`, `shadow-lg`) are theme-aware — light uses subtle blue-grey shadows, dark uses heavier black + an inset top highlight for depth.

**Composition rules:**

- A card (`bg-card`) lives on top of `bg-background`. Never place a card on another card.
- Use `bg-surface-raised` when you need a third elevation above card.
- A popover (`bg-popover`) can float over any surface.
- Use `bg-muted/50` for inner-region distinction instead of nesting cards.

---

## Shapes

Base radius is `0.625rem` (10px). All steps derive via multiplication — changing `--radius` shifts every step proportionally.

| Token         | Value | Use for                                       |
| ------------- | ----- | --------------------------------------------- |
| `rounded-sm`  | 6px   | Badges, tags, small chips, inner corners      |
| `rounded-md`  | 8px   | Buttons, inputs, select triggers, small cards |
| `rounded-lg`  | 10px  | Standard cards, dialog boxes, modals          |
| `rounded-xl`  | 14px  | Larger panels, sheet drawers, feature cards   |
| `rounded-2xl` | 18px  | Full-bleed section containers                 |
| `rounded-3xl` | 22px  | Pill shapes on large elements                 |
| `rounded-4xl` | 26px  | Maximum rounding — avatar containers          |

Do not use arbitrary radius values when a scale step fits. Do not use `rounded-full` for rectangular elements.

---

## Components

### Button

Six semantic variants: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`.

Size scale:

| Size        | Height   | Class     |
| ----------- | -------- | --------- |
| xs          | 24px     | `h-6`     |
| sm          | 28px     | `h-7`     |
| **default** | **32px** | **`h-8`** |
| lg          | 40px     | `h-10`    |
| icon        | 32px     | `size-8`  |
| icon-xs     | 24px     | `size-6`  |
| icon-sm     | 28px     | `size-7`  |
| icon-lg     | 36px     | `size-9`  |

Smart SVG-aware padding via `has-data-[icon]` selectors — buttons with icons get tighter inline padding automatically.

Icon sizes scale with button size:

| Button size    | Icon size |
| -------------- | --------- |
| xs / icon-xs   | 14px      |
| sm / icon-sm   | 16px      |
| default / icon | 18px      |
| lg / icon-lg   | 20px      |

States: normal, hover, active, disabled (`opacity-50`, no pointer events), focus (`outline-solid outline-2 outline-ring`).

### Card

- Always use `bg-card` not `bg-background` for the surface.
- Footer should contain actions only — not descriptive text.

### Input / Textarea

- Default height: 32px (`h-8`), matching the default button. Input-like triggers (Select, InputGroup, CommandInput) share this height.
- Radius: `rounded-lg` (10px), matching the installed component. ⚠ **Radius flag:** the front matter states `rounded.lg` but the Shapes table lists inputs under `rounded-md`. The installed component renders `rounded-lg`. DESIGN.md has been made consistent with the installed component; the Shapes table entry for inputs should be reviewed.
- Label is always required (visible or via `aria-label`).
- `aria-invalid="true"` activates error state styling automatically.
- Textarea has no fixed height — it grows with content (`field-sizing-content`, `min-h-16`).

#### Field width

`Input` has no width prop — width is a layout concern. Most fields need no explicit width: they fill their container by default. Apply a width only when the field's content length is meaningful to the user — a postcode field that spans half the screen misleads more than it helps. When a width is needed, apply it to the wrapping `Field` or a layout container; prefer the wrapping `Field` over `Input` directly so the label and input constrain together.

Two strategies:

- **Fixed** (`w-24`, `w-32`, `w-64`, `w-80`) — always that width regardless of container. Use when the expected content has a known character length (codes, numbers, names).
- **Fluid-constrained** (`w-full max-w-md`, `max-w-lg`, or `max-w-xl`) — fills the container up to a cap. Use for open-ended fields (address, URL, search) where screen width varies.

Apply `max-w-*` to the `Field` wrapper, not the `Input` directly. The constraint only takes effect when the container is wider than the cap — inside a narrow grid column a `max-w-lg` field will simply fill the column.

| Field             | Strategy     | Tailwind          |
| ----------------- | ------------ | ----------------- |
| PIN / short code  | fixed narrow | `w-24`            |
| Postcode / ZIP    | fixed narrow | `w-32`            |
| Number / quantity | fixed narrow | `w-24`            |
| First / last name | fixed medium | `w-64`            |
| Phone             | fixed medium | `w-64`            |
| Email             | fixed wide   | `w-80`            |
| URL               | fluid        | `w-full max-w-lg` |
| Address line      | fluid        | `w-full max-w-lg` |
| Search            | fluid        | `w-full max-w-md` |
| Long free text    | fluid        | `w-full max-w-xl` |

For a standalone `InputGroup` without a `Field` wrapper, apply width directly to `InputGroup` (`<InputGroup className="w-64">`). Inside a `Field`, apply width to the `Field` — `Field`'s `*:w-full` fills the group to match automatically. Do not apply a fixed width to `InputGroup` when it is inside a `Field`; the `Field` rule will override it.

### Form layout

#### Field gap and row container

`FieldGroup` is the row container for form sections. It is already a `@container/field-group` context. Use `FieldGroup` without a gap override — its default `gap-5` (20px) is the field gap. Apply the gap once on `FieldGroup` — never add margin to individual fields. Spacing inside a field (label to input, help text, error) is inherited from the shadcn Field components.

Note: `gap-5` (20px) sits between the `md` (16px) and `lg` (24px) spacing tokens and is not a named token in the DESIGN.md scale. It is the shadcn `FieldGroup` component default and is used as-is.

Each form section (a `FieldSet` containing a `FieldGroup`) is a block in its own right. Composite forms assemble multiple section blocks.

#### Form split container size

The form split size is `@2xl` (42rem / 672px). Below this container width all fields collapse to a single column in source order. `FieldGroup` responds to its own container width — no additional wrapper is needed. Viewport breakpoints do not drive the collapse.

#### Group spacing token

The spacing between field groups, and between children of a composite form, uses `gap-5` (20px) — matching the `FieldGroup` field gap so vertical rhythm is consistent throughout.

#### Label style

`FieldLabel` renders `text-sm` (14px) with `font-medium` (weight 500). This corresponds to the `small` type scale size with an increased weight. The label token is `small` at weight 500.

#### Touch condition and touch sizes

On touch devices (coarse pointer input), form controls use the `lg` size variant and the body text size (16px). The touch condition is `@media (pointer: coarse)`, applied via Tailwind's arbitrary variant syntax: `[@media(pointer:coarse)]:size-lg`. The body text size prevents iOS Safari from zooming into focused inputs. All input components (`Input`, `Textarea`, `SelectTrigger`) now support `size="lg"` (`h-10`, `text-base`).

### Dialog

- Use for consequential actions requiring explicit confirmation.
- Always include a clear title and description.
- Provide both confirm and escape paths.

### Popover / Dropdown Menu

- Use popover for rich content (filters, pickers, form snippets).
- Use dropdown menu for lists of actions.
- Never nest a dropdown inside a popover.

### Badge

Six variants: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`.

### Tooltip

- Always provide a tooltip for icon-only buttons.
- Keep content under 60 characters.

---

## Component Conventions

All components follow the shadcn b0 pattern:

```tsx
function Component({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"element"> &
  VariantProps<typeof componentVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "element";

  return (
    <Comp
      data-slot="component"
      data-variant={variant}
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

Key patterns:

- `data-slot` attributes enable parent components to target children via CSS selectors.
- `asChild` pattern (via `Slot.Root` from `radix-ui`) allows rendering as a different element.
- Import from `radix-ui` (the unified package), not individual `@radix-ui/react-*` packages.
- No `React.forwardRef` — use `React.ComponentProps<>` for prop typing.
- CVA (`class-variance-authority`) for variant management.

---

## Do's and Don'ts

**Colors**

- Always use Tailwind utilities (`bg-primary`, `text-muted-foreground`).
- Use oklch() values only in `index.css` token definitions.
- Never hardcode hex, rgb, or oklch values in component files.
- Never use Tailwind grey classes (`gray-100`, `slate-500`).
- Never use `bg-background` as a card or panel surface.

**Typography**

- Use `font-sans` (Geist) for all UI text. It is set globally.
- Use `font-mono` (Geist Mono) for code and identifiers.
- Never mix heading and body fonts at the same visual level.
- Apply `text-wrap: balance` (`text-balance`) to Display, Heading 1–3 — prevents jagged single-word orphan lines in short headings.
- Apply `text-wrap: pretty` (`text-pretty`) to Body copy — avoids orphan words at paragraph end without the full reflow cost of `balance`.
- In reading-heavy layouts, constrain body text to `max-w-prose` (~65ch). WCAG 2.2 SC 1.4.8 (AAA) recommends ≤ 80 characters; this is not an AA requirement but is worth targeting for long-form content.

**Spacing**

- Use the 4px grid. Prefer `p-4`, `gap-3`, `mt-6` over arbitrary values.
- Never use `p-[13px]` or similar non-grid values.

**Elevation**

- Use `bg-card` for panels and surfaces. Use `bg-surface-raised` for stacked elevations.
- Use `bg-muted/50` for inner-section distinction instead of nesting cards.
- Never nest `bg-card` inside `bg-card`.

**Radius**

- Use scale tokens (`rounded-md`, `rounded-lg`) for all components.
- Never use `rounded-full` on rectangular elements.
- Never use arbitrary radius values when a scale step fits.
