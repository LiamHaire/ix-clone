// Motion tokens — single source of truth for all animation values.
// The CSS custom properties in globals.css must always match these.
// If you change one, change the other in the same commit.

export const SPRING_GROW = { response: 0.5, damping: 0.72 };
export const SPRING_GROW_DURATION_MS = 800;
// EXPERIMENT: same response, lower damping (about 7.6% overshoot) for the additional panel
export const SPRING_PANEL = { response: 0.5, damping: 0.634 };

export const SHRINK_EASING = 'cubic-bezier(0.45, 0, 0.2, 1)';
export const SHRINK_MS = 340;

export const EASE_OUT_CUBIC   = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
export const EASE_IN_CUBIC    = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
export const EASE_IN_OUT_CUBIC = 'cubic-bezier(0.645, 0.045, 0.355, 1)';
export const EASE_BACK_OUT    = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

export const DUR_FAST = 120;   // ms — hover, press, selected state
export const DUR_BASE = 200;   // ms — fades, small reveals
export const DUR_SLOW = 340;   // ms — matches SHRINK_MS

export const DUR_HOVER = 150;  // ms — Tailwind default transition duration (hovers, colour changes)

export const EASE_STANDARD    = 'cubic-bezier(0.25, 0.1, 0.25, 1)'; // CSS `ease`
export const EASE_OUT_EXPO    = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const EASE_PLACEHOLDER_EXIT = 'cubic-bezier(0.4, 0, 1, 1)';

// Layout panels
export const PANEL_RESIZE_MS = 500;

// Chat landing-to-conversation sequence
export const CHAT_MOVE_MS          = 550;
export const CHAT_FADE_MS          = 400;
export const CHAT_OVERLAY_FADE_MS  = 500;
export const CHAT_REVEAL_MS        = 350;

// Component-specific
export const TABS_INDICATOR_MS    = 250;
export const PLACEHOLDER_HOLD_MS  = 8000;
export const PLACEHOLDER_ROLL_MS  = 400;
export const THINKING_DOT_MS      = 130;
export const THINKING_TEXT_MS     = 250;
export const NOTCH_SUCCESS_MS     = 250;
export const NOTCH_SHIMMER_MS     = 1800;
export const NOTCH_CHECK_HOLD_MS  = 1400; // static hold before the success check fades out
export const NOTCH_CHECK_RING_MS  = 300;
export const NOTCH_CHECK_BUBBLE_MS = 500;
export const NOTCH_CHECK_DELAY_MS = 180;

// Landing title bounce (components/title-bounce.tsx): letters drop in one by one, then the dot lands
export const TITLE_STAGGER_MS = 22;
export const TITLE_CHAR_MS    = 260;
export const TITLE_HOLD_MS    = 30;   // pause between the last letter and the dot
export const TITLE_DOT_MS     = 360;

export const TITLE_LETTER_KEYFRAMES: Keyframe[] = [
  { translate: '0 -0.55em', opacity: 0, offset: 0 },
  { translate: '0 0.09em',  opacity: 1, offset: 0.6 },
  { translate: '0 -0.025em', opacity: 1, offset: 0.82 },
  { translate: '0 0',       opacity: 1, offset: 1 },
];

export const TITLE_DOT_KEYFRAMES: Keyframe[] = [
  { translate: '0 -0.9em',  scale: '0.7 1.35',  opacity: 0, offset: 0,    easing: 'cubic-bezier(.5,0,.9,.6)' },
  { translate: '0 -0.45em', scale: '0.8 1.25',  opacity: 1, offset: 0.2,  easing: 'cubic-bezier(.5,0,.9,.6)' },
  { translate: '0 0',       scale: '1.5 0.6',   opacity: 1, offset: 0.5,  easing: 'cubic-bezier(.2,.7,.4,1)' },
  { translate: '0 -0.2em',  scale: '0.9 1.12',  opacity: 1, offset: 0.72, easing: 'cubic-bezier(.6,0,.9,.5)' },
  { translate: '0 0',       scale: '1.15 0.85', opacity: 1, offset: 0.88, easing: 'linear' },
  { translate: '0 0',       scale: '1 1',       opacity: 1, offset: 1 },
];

// EXPERIMENT: set to false to revert chat/workspace/additional panel moves to the
// original smooth ease-out-expo slide.
export const PANEL_SPRING_EXPERIMENT = true;

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
  durHover:        'var(--dur-hover)',
  easeStandard:    'var(--ease-standard)',
  easeOutExpo:     'var(--ease-out-expo)',
  durPanelResize:  'var(--dur-panel-resize)',
} as const;

// Flex transitions for the chat / workspace / additional panel split.
// Opening uses the notch spring grow; closing uses the shrink curve.
const PANEL_FLEX_SLIDE = `flex ${CSS.durPanelResize} ${CSS.easeOutExpo}`;
export const PANEL_FLEX_OPEN  = PANEL_SPRING_EXPERIMENT ? `flex ${CSS.durSpringGrow} ${CSS.easeSpringGrow}` : PANEL_FLEX_SLIDE;
export const PANEL_FLEX_OPEN_ADDITIONAL = PANEL_SPRING_EXPERIMENT ? `flex ${CSS.durSpringGrow} var(--ease-spring-panel)` : PANEL_FLEX_SLIDE;
// Workspace <-> additional swap: the divider overshoots in its own direction of travel.
// Pair per swap: leaving panel = SWAP_OUT, arriving panel = SWAP_IN_LEFT (to additional) or
// SWAP_IN_RIGHT (to workspace), chat = PANEL_FLEX_OPEN. Curves are derived in globals.css.
const swap = (name: string) => PANEL_SPRING_EXPERIMENT ? `flex ${CSS.durSpringGrow} var(--ease-spring-swap-${name})` : PANEL_FLEX_SLIDE;
export const PANEL_FLEX_SWAP_OUT      = swap('out');
export const PANEL_FLEX_SWAP_IN_LEFT  = swap('in-left');
export const PANEL_FLEX_SWAP_IN_RIGHT = swap('in-right');
export const PANEL_FLEX_CLOSE =PANEL_SPRING_EXPERIMENT ? `flex ${CSS.durShrink} ${CSS.easeShrink}` : PANEL_FLEX_SLIDE;
