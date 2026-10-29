// Pure state machine — no React, no DOM imports.
// Wrapped by useNotchMachine in notch-hook.ts.

export type NotchState = 'compact' | 'expanded';

export type NotchEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'DRAG_ENTER' }
  | { type: 'DRAG_LEAVE' }
  | { type: 'DROP' }
  | { type: 'SHOW_DROP' }
  | { type: 'PROGRESS'; value: number }
  | { type: 'UPLOAD_COMPLETE' }
  | { type: 'UPLOAD_ERROR'; message: string }
  | { type: 'DISMISS_ERROR' }
  | { type: 'CANCEL_DROP' };

export type DropPhase =
  | 'idle'
  | 'dragging'
  | 'uploading'
  | 'success'
  | 'error';

export interface NotchMachineState {
  notch: NotchState;
  dropPhase: DropPhase;
  errorMessage: string | null;
  uploadProgress: number; // 0–1
}

export const INITIAL_STATE: NotchMachineState = {
  notch: 'compact',
  dropPhase: 'idle',
  errorMessage: null,
  uploadProgress: 0,
};

export function transition(
  state: NotchMachineState,
  event: NotchEvent,
): NotchMachineState {
  const { notch, dropPhase } = state;

  switch (event.type) {
    case 'OPEN':
      return { ...state, notch: 'expanded' };

    case 'CLOSE':
      // Don't close while uploading
      if (dropPhase === 'uploading') return state;
      return { ...state, notch: 'compact', dropPhase: 'idle', errorMessage: null };

    case 'SHOW_DROP':
      return { ...state, dropPhase: 'idle' };

    case 'DRAG_ENTER':
      if (dropPhase === 'uploading') return state;
      return { ...state, notch: 'expanded', dropPhase: 'dragging' };

    case 'DRAG_LEAVE':
      return { ...state, dropPhase: dropPhase === 'dragging' ? 'dragging' : dropPhase };

    case 'DROP':
      if (dropPhase !== 'dragging') return state;
      // Collapse to the status pill; progress is shown there
      return { ...state, notch: 'compact', dropPhase: 'uploading', uploadProgress: 0 };

    case 'PROGRESS':
      if (dropPhase !== 'uploading') return state;
      return { ...state, uploadProgress: event.value };

    case 'UPLOAD_COMPLETE':
      return { ...state, dropPhase: 'success', uploadProgress: 1 };

    case 'UPLOAD_ERROR':
      // Errors need the full panel to show the message
      return { ...state, notch: 'expanded', dropPhase: 'error', errorMessage: event.message };

    case 'DISMISS_ERROR':
      return { ...state, dropPhase: 'idle', errorMessage: null };

    case 'CANCEL_DROP':
      return { ...state, dropPhase: 'idle', errorMessage: null };

    default:
      return state;
  }
}
