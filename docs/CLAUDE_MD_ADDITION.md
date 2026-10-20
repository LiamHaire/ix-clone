## Motion and the notch

- All animation uses the tokens in `lib/motion.ts` and the CSS custom
  properties in `docs/MOTION.md`. Do not hard-code durations or easings.
- Read `docs/MOTION.md` before adding or changing any animation.
- The notch component is specified in `docs/NOTCH_SPEC.md`. Read it before
  changing the notch's behaviour, navigation or drop flow.
- Animate `transform` and `opacity` everywhere except the notch's own width,
  height and corner radius.
- Nothing may run (timers, `requestAnimationFrame`, polling) while the notch is
  hidden.
- If `docs/MOTION.md` and `lib/motion.ts` disagree, fix both in the same
  commit.
