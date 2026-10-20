'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { StopCircle } from '@phosphor-icons/react';
import { useNotchMachine } from './notch-hook';
import { NotchHeader, type NavId } from './notch-nav';
import { NotchView, VIEW_HEIGHTS } from './notch-views';
import { DropZone, UploadingView, SuccessView, ErrorView, validateFile } from './notch-drop';
import { NotchSettingsView } from './notch-settings';
import { CSS, SPRING_GROW_DURATION_MS, SHRINK_MS } from '@/lib/motion';

// ── Geometry config ───────────────────────────────────────────────────────────
const PILL_WIDTH  = 180;
const PILL_HEIGHT = 36;
const PILL_RADIUS = '0 0 12px 12px'; // only bottom corners rounded

const PANEL_WIDTH   = 720;
const SETTINGS_PANEL_WIDTH = 960;
const PANEL_RADIUS  = '0 0 24px 24px';

// Header height in px — used to compute total panel height
const HEADER_H = 44;
// Content height when no nav item is selected (drop zone default)
const DEFAULT_CONTENT_H = 176;

// How long success view shows before notch collapses (ms)
const SUCCESS_LINGER_MS = 1200;

interface NotchShellProps {
  className?: string;
}

export function NotchShell(_props: NotchShellProps) {
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState<NavId | null>('notifications');
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [prevContentH, setPrevContentH] = useState(DEFAULT_CONTENT_H);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);

  const { state, send, progressRef } = useNotchMachine();
  const { notch, dropPhase, errorMessage } = state;
  const [contentReady, setContentReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // ── Determine content height for view-swap animation ──────────────────────
  const contentH = (() => {
    if (dropPhase !== 'idle') return DEFAULT_CONTENT_H;
    if (activeNav) return VIEW_HEIGHTS[activeNav];
    return DEFAULT_CONTENT_H;
  })();

  const panelH = HEADER_H + contentH;

  // ── Grow vs shrink rule: taller-or-equal = spring, shorter = curve ─────────
  const heightEasing = contentH >= prevContentH
    ? `${CSS.easeSpringGrow} ${CSS.durSpringGrow}`
    : `${CSS.easeShrink} ${CSS.durShrink}`;

  const handleNavSelect = (id: NavId) => {
    if (id === 'settings') {
      setSettingsOpen(true);
      setActiveNav(null);
      return;
    }
    if (id === 'record') {
      toggleRecording();
      return;
    }
    setSettingsOpen(false);
    setPrevContentH(contentH);
    setActiveNav((prev) => (prev === id ? null : id));
  };

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
      setRecordingSeconds(0);
      setIsRecording(false);
      toast.success('Recording stopped');
    } else {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
      setIsRecording(true);
      send({ type: 'CLOSE' });
    }
  }, [isRecording, send]);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  // ── Close on click outside ────────────────────────────────────────────────
  useEffect(() => {
    if (notch !== 'expanded') return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        send({ type: 'CLOSE' });
      }
    };
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 10);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handler); };
  }, [notch, send]);

  // ── Escape closes ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (notch !== 'expanded') return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') send({ type: 'CLOSE' }); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [notch, send]);

  // ── Window-level drag listeners ───────────────────────────────────────────
  const isFilesDrag = (dt: DataTransfer | null) =>
    dt?.types.includes('Files') ?? false;

  const handleDragEnter = useCallback((e: DragEvent) => {
    if (!isFilesDrag(e.dataTransfer)) return;
    dragDepthRef.current++;
    if (dragDepthRef.current === 1) send({ type: 'DRAG_ENTER' });
  }, [send]);

  const handleDragOver = useCallback((e: DragEvent) => {
    if (!isFilesDrag(e.dataTransfer)) return;
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    if (!isFilesDrag(e.dataTransfer)) return;
    dragDepthRef.current--;
    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0;
      send({ type: 'DRAG_LEAVE' });
    }
  }, [send]);

  const handleWindowDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragDepthRef.current = 0;
    if (!isFilesDrag(e.dataTransfer)) return;
    const files = e.dataTransfer?.files;
    if (!files?.length) return;
    processFiles(files);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover',  handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop',      handleWindowDrop);
    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover',  handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop',      handleWindowDrop);
    };
  }, [handleDragEnter, handleDragOver, handleDragLeave, handleWindowDrop]);

  // ── File processing ───────────────────────────────────────────────────────
  const processFiles = (files: FileList) => {
    const file = files[0];
    const error = validateFile(file);
    if (error) {
      send({ type: 'DROP' }); // transition first so machine is in right state
      send({ type: 'UPLOAD_ERROR', message: error });
      return;
    }
    setDroppedFile(file);
    send({ type: 'DROP' });
  };

  // ── React to upload completion ────────────────────────────────────────────
  useEffect(() => {
    if (dropPhase !== 'success') return;
    toast.success('Upload successful', {
      description: droppedFile ? droppedFile.name : undefined,
    });
    const t = setTimeout(() => {
      send({ type: 'CLOSE' });
      setDroppedFile(null);
    }, SUCCESS_LINGER_MS);
    return () => clearTimeout(t);
  }, [dropPhase, droppedFile, send]);

  const isExpanded = notch === 'expanded';
  const showDropContent = dropPhase !== 'idle';

  useEffect(() => {
    if (!isExpanded) setContentReady(false);
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded) setSettingsOpen(false);
  }, [isExpanded]);

  if (!mounted) return null;

  const mm = String(Math.floor(recordingSeconds / 60)).padStart(2, '0');
  const ss = String(recordingSeconds % 60).padStart(2, '0');
  const recordingLabel = `${mm}:${ss}`;

  // ── Pill / panel sizing ───────────────────────────────────────────────────
  const width  = isExpanded ? (settingsOpen ? SETTINGS_PANEL_WIDTH : PANEL_WIDTH) : PILL_WIDTH;
  const height = isExpanded ? 'auto' : PILL_HEIGHT;
  const radius = isExpanded ? PANEL_RADIUS : PILL_RADIUS;

  const expandEasing  = `${CSS.easeSpringGrow} ${CSS.durSpringGrow}`;
  const collapseEasing = `${CSS.easeShrink} ${CSS.durShrink}`;
  const sizeEasing = isExpanded ? expandEasing : collapseEasing;

  const scrim = isExpanded ? createPortal(
    <div
      aria-hidden="true"
      onClick={() => send({ type: 'CLOSE' })}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.25)',
        animation: 'notch-scrim-in 200ms var(--ease-out-cubic) forwards',
      }}
    />,
    document.body,
  ) : null;

  const island = createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={containerRef}
        aria-expanded={isExpanded}
        onTransitionEnd={(e) => { if (e.propertyName === 'width' && isExpanded) setContentReady(true); }}
        style={{
          width,
          height,
          borderRadius: radius,
          overflow: 'hidden',
          pointerEvents: 'auto',
          minHeight: isExpanded ? 240 : undefined,
          maxHeight: isExpanded ? 'calc(100vh - 120px)' : undefined,
          background: 'var(--surface-raised)',
          border: `1px solid ${isRecording && !isExpanded ? 'var(--destructive)' : 'var(--border)'}`,
          borderTop: 'none',
          boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transition: [
            `width ${sizeEasing}`,
            `height ${isExpanded ? `${CSS.easeSpringGrow} ${CSS.durSpringGrow}` : heightEasing}`,
            `border-radius ${sizeEasing}`,
            `border-color ${CSS.durBase} ${CSS.easeOutCubic}`,
            `box-shadow ${CSS.durBase} ${CSS.easeOutCubic}`,
          ].join(', '),
        }}
      >
        {/* ── Pill (collapsed) ── */}
        {!isExpanded && !isRecording && (
          <button
            type="button"
            aria-label="Open navigation panel"
            onClick={() => send({ type: 'OPEN' })}
            className="flex items-center justify-center w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            style={{ background: 'transparent' }}
          >
            <span
              className="block rounded-full bg-current opacity-40"
              style={{ width: 24, height: 4 }}
            />
          </button>
        )}

        {/* ── Recording pill ── */}
        {!isExpanded && isRecording && (
          <div className="flex items-center justify-between w-full h-full px-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-destructive animate-pulse shrink-0" />
              <span className="text-[13px] font-medium tabular-nums text-foreground">{recordingLabel}</span>
            </div>
            <button
              type="button"
              aria-label="Stop Scribe"
              onClick={toggleRecording}
              className="flex items-center justify-center size-6 rounded-full text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <StopCircle size={18} weight="fill" />
            </button>
          </div>
        )}

        {/* ── Expanded panel ── */}
        {isExpanded && (
          <div
            className="flex flex-col"
            style={{
              animation: `notch2-expand-content ${CSS.durBase} ${CSS.easeOutCubic} both`,
              pointerEvents: contentReady ? 'auto' : 'none',
              maxHeight: 'calc(100vh - 120px)',
              overflow: 'hidden',
            }}
          >
            {/* Header — always visible */}
            <NotchHeader
              activeId={showDropContent ? null : settingsOpen ? 'settings' : activeNav}
              onSelect={handleNavSelect}
              isRecording={isRecording}
              onUpload={() => send({ type: 'SHOW_DROP' })}
            />

            {/* Content area */}
            <div className="relative">
              {settingsOpen ? (
                <NotchSettingsView onClose={() => setSettingsOpen(false)} />
              ) : showDropContent ? (
                <div className="p-4" style={{ minHeight: 240 - HEADER_H }}>
                  <DropContent
                    dropPhase={dropPhase}
                    errorMessage={errorMessage}
                    fileName={droppedFile?.name ?? ''}
                    isDragging={dropPhase === 'dragging'}
                    progress={progressRef.current}
                    fileInputRef={fileInputRef}
                    onBrowse={() => fileInputRef.current?.click()}
                    onFileSelected={processFiles}
                    onDismiss={() => send({ type: 'DISMISS_ERROR' })}
                    onCancel={() => send({ type: 'CANCEL_DROP' })}
                  />
                </div>
              ) : (
                <div
                  key={activeNav ?? 'default'}
                  style={{
                    animation: `notch2-expand-content ${CSS.durBase} ${CSS.easeOutCubic} both`,
                  }}
                >
                  <NotchView
                    id={activeNav}
                    onViewAllSessions={() => { send({ type: 'CLOSE' }); window.dispatchEvent(new CustomEvent('ix:open-session-history')); }}
                    onViewAllTasks={() => { send({ type: 'CLOSE' }); window.dispatchEvent(new CustomEvent('ix:open-work')); }}
                    onViewAllNotifications={() => { send({ type: 'CLOSE' }); }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );

  return <>{scrim}{island}</>;
}

// ── Drop content switcher ─────────────────────────────────────────────────────

interface DropContentProps {
  dropPhase: string;
  errorMessage: string | null;
  fileName: string;
  isDragging: boolean;
  progress: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onBrowse: () => void;
  onFileSelected: (files: FileList) => void;
  onDismiss: () => void;
  onCancel: () => void;
}

function DropContent({
  dropPhase,
  errorMessage,
  fileName,
  isDragging,
  progress,
  fileInputRef,
  onBrowse,
  onFileSelected,
  onDismiss,
}: DropContentProps) {
  if (dropPhase === 'uploading') {
    return <UploadingView fileName={fileName} progress={progress} />;
  }
  if (dropPhase === 'success') {
    return <SuccessView />;
  }
  if (dropPhase === 'error') {
    return <ErrorView message={errorMessage ?? 'An error occurred.'} onDismiss={onDismiss} />;
  }
  // dragging or idle (but in drop flow)
  return (
    <DropZone
      isDragging={isDragging}
      onBrowse={onBrowse}
      inputRef={fileInputRef}
      onFileSelected={onFileSelected}
    />
  );
}
