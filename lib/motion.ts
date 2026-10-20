// Motion tokens — single source of truth for all animation values.
// The CSS custom properties in globals.css must always match these.
// If you change one, change the other in the same commit.

export const SPRING_GROW = { response: 0.5, damping: 0.72 };
export const SPRING_GROW_DURATION_MS = 800;

export const SHRINK_EASING = 'cubic-bezier(0.45, 0, 0.2, 1)';
export const SHRINK_MS = 340;

export const EASE_OUT_CUBIC   = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
export const EASE_IN_CUBIC    = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
export const EASE_IN_OUT_CUBIC = 'cubic-bezier(0.645, 0.045, 0.355, 1)';
export const EASE_BACK_OUT    = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

export const DUR_FAST = 120;   // ms — hover, press, selected state
export const DUR_BASE = 200;   // ms — fades, small reveals
export const DUR_SLOW = 340;   // ms — matches SHRINK_MS

// CSS var references (for inline styles that need to reference the tokens)
export const CSS = {
  easeSpringGrow:  'var(--ease-spring-grow)',
  durSpringGrow:   'var(--dur-spring-grow)',
  easeShrink:      'var(--ease-shrink)',
  durShrink:       'var(--dur-shrink)',
  easeOutCubic:    'var(--ease-out-cubic)',
  easeInCubic:     'var(--ease-in-cubic)',
  easeInOutCubic:  'var(--ease-in-out-cubic)',
  easeBackOut:     'var(--ease-back-out)',
  durFast:         'var(--dur-fast)',
  durBase:         'var(--dur-base)',
} as const;
