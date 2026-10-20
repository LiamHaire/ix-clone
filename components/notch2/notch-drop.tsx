'use client';

import { useRef } from 'react';
import { UploadSimple, X, File as FileIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { CSS } from '@/lib/motion';

// Max file size in bytes — unconstrained by default, tune per project
const MAX_FILE_BYTES = Infinity;
// Allowed MIME types — empty array means all allowed
const ALLOWED_MIME_TYPES: string[] = [];
// Reject directories — true means directories are rejected with a message
const REJECT_DIRECTORIES = true;

function validateFile(file: File): string | null {
  if (REJECT_DIRECTORIES && file.size === 0 && file.type === '') {
    return `"${file.name}" appears to be a directory. Directories are not supported.`;
  }
  if (MAX_FILE_BYTES !== Infinity && file.size > MAX_FILE_BYTES) {
    return `"${file.name}" exceeds the maximum file size.`;
  }
  if (ALLOWED_MIME_TYPES.length > 0 && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return `"${file.name}" is not an allowed file type.`;
  }
  return null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Drop zone view (dragging state) ──────────────────────────────────────────

interface DropZoneProps {
  isDragging: boolean;
  onBrowse: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelected: (files: FileList) => void;
}

export function DropZone({ isDragging, onBrowse, inputRef, onFileSelected }: DropZoneProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed select-none transition-colors',
      )}
      style={{
        minHeight: 160,
        borderColor: 'var(--muted-foreground)',
        background: isDragging ? 'var(--accent)' : 'transparent',
        transition: `border-color ${CSS.durBase} ${CSS.easeOutCubic}, background ${CSS.durBase} ${CSS.easeOutCubic}`,
        animation: 'none',
      }}
    >
      <UploadSimple
        size={48}
        weight="regular"
        style={{ color: 'var(--muted-foreground)' }}
      />
      <p className="text-sm text-foreground font-medium">
        {isDragging ? 'Release to add to Knowledge Base' : 'Drag and drop to add to Knowledge Base'}
      </p>
      <button
        type="button"
        onClick={onBrowse}
        className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        style={{ transition: `color ${CSS.durFast} ${CSS.easeOutCubic}` }}
      >
        or click to browse
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => { if (e.target.files?.length) onFileSelected(e.target.files); }}
      />
    </div>
  );
}

// ── Uploading view ────────────────────────────────────────────────────────────

interface UploadingViewProps {
  fileName: string;
  progress: number; // 0–1
}

export function UploadingView({ fileName, progress }: UploadingViewProps) {
  const pct = Math.round(progress * 100);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
      <FileIcon size={28} weight="duotone" className="text-muted-foreground" />
      <p className="text-sm font-medium text-foreground truncate max-w-full">{fileName}</p>
      <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full origin-left"
          style={{
            width: `${pct}%`,
            background: 'var(--foreground)',
            transition: `width ${CSS.durFast} ${CSS.easeOutCubic}`,
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{pct}%</p>
    </div>
  );
}

// ── Success view ─────────────────────────────────────────────────────────────

export function SuccessView() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <span
        className="flex items-center justify-center size-10 rounded-full"
        style={{
          background: 'var(--accent)',
          animation: 'notch2-success-pop var(--ease-back-out) 0.25s both',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10l4 4 8-8" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <p className="text-sm font-medium text-foreground">Upload successful</p>
    </div>
  );
}

// ── Error view ────────────────────────────────────────────────────────────────

interface ErrorViewProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorView({ message, onDismiss }: ErrorViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 px-4 text-center">
      <p className="text-sm text-destructive">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        Dismiss
      </button>
    </div>
  );
}

// Export validate so the shell can call it before dispatching DROP
export { validateFile, formatBytes };
