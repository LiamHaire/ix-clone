import { CheckCircle } from '@phosphor-icons/react';
import { NOTCH_CHECK_HOLD_MS, DUR_BASE } from '@/lib/motion';

// Time from mount until the content has fully faded; close the notch after this.
export const NOTCH_COMPLETE_DURATION_MS = NOTCH_CHECK_HOLD_MS + DUR_BASE;

// Collapsed-notch "complete" animation: ring pops in, check bubbles up with a
// spring overshoot, holds static, then fades out. Fills the collapsed pill.
export function NotchComplete({ label = 'Complete' }: { label?: string }) {
  return (
    <div className="n3-success-out flex items-center justify-center w-full h-full" role="status" aria-label={label}>
      <span className="relative inline-flex size-5 text-success" aria-hidden="true">
        <CheckCircle className="n3-success-ring absolute inset-0" size={20} weight="regular" />
        <CheckCircle className="n3-success-check absolute inset-0" size={20} weight="regular" />
      </span>
    </div>
  );
}
