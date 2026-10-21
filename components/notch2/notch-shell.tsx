'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { StopCircle, BellRinging, CalendarBlank, FileText, CheckCircle } from '@phosphor-icons/react';
import { useNotchMachine } from './notch-hook';
import { NotchHeader, type NavId } from './notch-nav';
import { NotchView, VIEW_HEIGHTS } from './notch-views';
import { DropZone, UploadingView, SuccessView, ErrorView, validateFile } from './notch-drop';
import { NotchSettingsView } from './notch-settings';
import { CSS, SPRING_GROW_DURATION_MS, SHRINK_MS } from '@/lib/motion';

// ── Geometry ──────────────────────────────────────────────────────────────────
const PILL_WIDTH           = 180;
const PILL_HEIGHT          = 36;
const PILL_RADIUS          = '0 0 12px 12px';
const PANEL_WIDTH          = 720;
const SETTINGS_PANEL_WIDTH = 960;
const PANEL_RADIUS         = '0 0 24px 24px';
const HEADER_H             = 44;
const DEFAULT_CONTENT_H    = 176;
const SUCCESS_LINGER_MS    = 1200;

// ── Active view type ──────────────────────────────────────────────────────────
// One of the nav IDs, 'drop', or null (default/drop zone idle)
type ActiveView = NavId | 'drop' | null;

interface NotchShellProps {
  className?: string;
}

export function NotchShell(_props: NotchShellProps) {
  const [mounted, setMounted]               = useState(false);
  const [activeView, setActiveView]         = useState<ActiveView>('notifications');
  const [droppedFile, setDroppedFile]       = useState<File | null>(null);
  const [prevContentH, setPrevContentH]     = useState(DEFAULT_CONTENT_H);
  const [isRecording, setIsRecording]       = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [headerReady, setHeaderReady]       = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [notifyAnimKey, setNotifyAnimKey]     = useState(0);
  const [latestNotification, setLatestNotification] = useState<{ title: string; preview?: string } | null>(null);
  const [pillHovered, setPillHovered]         = useState(false);
  const [hasAppointment, setHasAppointment]   = useState(false);
  const [appointmentAnimKey, setAppointmentAnimKey] = useState(0);
  const [reportPhase, setReportPhase]         = useState<'idle' | 'shake' | 'check' | 'done'>('idle');
  const [reportAnimKey, setReportAnimKey]     = useState(0);
  const containerRef     = useRef<HTMLDivElement>(null);
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const dragDepthRef     = useRef(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const headerReadyTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { state, send, progressRef } = useNotchMachine();
  const { notch, dropPhase, errorMessage } = state;

  useEffect(() => { setMounted(true); }, []);

  const isExpanded = notch === 'expanded';

  // Dismiss alert when user views the relevant section
  useEffect(() => {
    if (!isExpanded) return;
    if (activeView === 'notifications' && hasNotification) {
      setHasNotification(false);
      setLatestNotification(null);
    }
    if (activeView === 'recent' && hasAppointment) {
      setHasAppointment(false);
    }
    if ((activeView === 'tasks' || activeView === 'recent') && reportPhase !== 'idle') {
      setReportPhase('idle');
    }
  }, [activeView, isExpanded]);

  // Switch to drop view when a drag enters
  useEffect(() => {
    if (dropPhase === 'dragging' || dropPhase === 'uploading') {
      setActiveView('drop');
    }
  }, [dropPhase]);

  // Reset to notifications when collapsed
  useEffect(() => {
    if (!isExpanded) {
      setActiveView('notifications');
      setHeaderReady(false);
      if (headerReadyTimer.current) clearTimeout(headerReadyTimer.current);
    } else {
      // Block tooltips for the full spring-grow duration on every open
      setHeaderReady(false);
      if (headerReadyTimer.current) clearTimeout(headerReadyTimer.current);
      headerReadyTimer.current = setTimeout(() => setHeaderReady(true), SPRING_GROW_DURATION_MS);
    }
  }, [isExpanded]);

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => { if (recordingTimerRef.current) clearInterval(recordingTimerRef.current); };
  }, []);

  // ── Pill alert event listeners ────────────────────────────────────────────
  useEffect(() => {
    const handler = () => {
      if (isExpanded) return;
      setHasNotification(true);
      setNotifyAnimKey(k => k + 1);
      setLatestNotification({ title: 'File review due', preview: "It's nearly a month since the last review…" });
    };
    window.addEventListener('ix:new-notification', handler);
    return () => window.removeEventListener('ix:new-notification', handler);
  }, [isExpanded]);

  useEffect(() => {
    const handler = () => {
      if (isExpanded) return;
      setHasAppointment(true);
      setAppointmentAnimKey(k => k + 1);
    };
    window.addEventListener('ix:appointment-reminder', handler);
    return () => window.removeEventListener('ix:appointment-reminder', handler);
  }, [isExpanded]);

  useEffect(() => {
    const handler = () => {
      if (isExpanded) return;
      setReportPhase('shake');
      setReportAnimKey(k => k + 1);
      setTimeout(() => setReportPhase('check'), 900);
      setTimeout(() => setReportPhase('done'), 1800);
    };
    window.addEventListener('ix:report-complete', handler);
    return () => window.removeEventListener('ix:report-complete', handler);
  }, [isExpanded]);

  // ── Close on click outside ────────────────────────────────────────────────
  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        send({ type: 'CLOSE' });
    };
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 10);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handler); };
  }, [isExpanded, send]);

  // ── Escape closes ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') send({ type: 'CLOSE' }); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isExpanded, send]);

  // ── Window-level drag listeners ───────────────────────────────────────────
  const isFilesDrag = (dt: DataTransfer | null) => dt?.types.includes('Files') ?? false;

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
    if (dragDepthRef.current <= 0) { dragDepthRef.current = 0; send({ type: 'DRAG_LEAVE' }); }
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
      send({ type: 'DROP' });
      send({ type: 'UPLOAD_ERROR', message: error });
      return;
    }
    setDroppedFile(file);
    send({ type: 'DROP' });
  };

  // ── Upload completion ─────────────────────────────────────────────────────
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

  // ── Nav handler — single source of truth ─────────────────────────────────
  const handleNavSelect = useCallback((id: NavId) => {
    if (id === 'record') {
      // Toggle recording
      if (isRecording) {
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
        setRecordingSeconds(0);
        setIsRecording(false);
        toast.success('Recording stopped');
      } else {
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
        setIsRecording(true);
        send({ type: 'CLOSE' });
      }
      return;
    }
    // All other icons: just set activeView
    setPrevContentH(contentHForView(activeView));
    setActiveView(id);
    // Also cancel any active drop flow when switching away
    if (dropPhase !== 'idle') send({ type: 'CANCEL_DROP' });
  }, [isRecording, activeView, dropPhase, send]);

  const handleUpload = useCallback(() => {
    setPrevContentH(contentHForView(activeView));
    setActiveView('drop');
    send({ type: 'SHOW_DROP' });
  }, [activeView, send]);

  // ── Sizing helpers ────────────────────────────────────────────────────────
  function contentHForView(view: ActiveView): number {
    if (view === 'drop' || view === null) return DEFAULT_CONTENT_H;
    if (view === 'settings') return 480;
    return VIEW_HEIGHTS[view] ?? DEFAULT_CONTENT_H;
  }

  if (!mounted) return null;

  const mm = String(Math.floor(recordingSeconds / 60)).padStart(2, '0');
  const ss = String(recordingSeconds % 60).padStart(2, '0');
  const recordingLabel = `${mm}:${ss}`;

  const alertCount = (hasNotification ? 1 : 0) + (hasAppointment ? 1 : 0) + (reportPhase !== 'idle' ? 1 : 0);
  const collapsedWidth = alertCount > 0 ? PILL_WIDTH + (alertCount - 1) * 28 : PILL_WIDTH;
  const contentH = contentHForView(activeView);
  const panelH   = HEADER_H + contentH;
  const width  = isExpanded ? (activeView === 'settings' ? SETTINGS_PANEL_WIDTH : PANEL_WIDTH) : collapsedWidth;
  const height = isExpanded ? panelH : PILL_HEIGHT;
  const radius = isExpanded ? PANEL_RADIUS : PILL_RADIUS;

  const expandEasing   = `${CSS.easeSpringGrow} ${CSS.durSpringGrow}`;
  const collapseEasing = `${CSS.easeShrink} ${CSS.durShrink}`;
  const sizeEasing     = isExpanded ? expandEasing : collapseEasing;

  // Header activeId — show the currently selected nav icon as active
  const headerActiveId: NavId | null =
    activeView === 'drop' || activeView === null ? null : activeView as NavId;

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
    <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, pointerEvents: 'none' }}>
      <div
        ref={containerRef}
        aria-expanded={isExpanded}
        style={{
          width,
          height,
          borderRadius: radius,
          overflow: 'hidden',
          pointerEvents: 'auto',
          background: 'var(--surface-raised)',
          borderTop: 'none',
          borderRight: `1px solid ${isRecording && !isExpanded ? 'var(--destructive)' : 'var(--border)'}`,
          borderBottom: `1px solid ${isRecording && !isExpanded ? 'var(--destructive)' : 'var(--border)'}`,
          borderLeft: `1px solid ${isRecording && !isExpanded ? 'var(--destructive)' : 'var(--border)'}`,
          boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transition: [
            `width ${sizeEasing}`,
            `height ${sizeEasing}`,
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
            onClick={() => {
              setPillHovered(false);
              send({ type: 'OPEN' });
            }}
            className="flex items-center justify-center gap-2 w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset text-foreground"
            style={{ background: 'transparent' }}
            onMouseEnter={() => setPillHovered(true)}
            onMouseLeave={() => setPillHovered(false)}
          >
            {alertCount === 0 ? (
              <span className="block rounded-full bg-current opacity-40" style={{ width: 24, height: 4 }} />
            ) : (
              <span className="flex items-center gap-2">
                {hasNotification && (
                  <span className="relative inline-flex items-center justify-center shrink-0">
                    <span key={notifyAnimKey} className="notch-notify-shake inline-flex"><BellRinging size={18} weight="regular" /></span>
                    <span className="notch-badge-pop absolute -bottom-1 -right-1.5 flex items-center justify-center size-3 rounded-full bg-destructive text-[7px] font-bold text-white leading-none">1</span>
                  </span>
                )}
                {hasAppointment && (
                  <span className="relative inline-flex items-center justify-center shrink-0">
                    <span key={appointmentAnimKey} className="notch-notify-shake inline-flex"><CalendarBlank size={18} weight="regular" /></span>
                  </span>
                )}
                {reportPhase !== 'idle' && (
                  <span key={reportAnimKey} className="relative inline-flex items-center justify-center shrink-0">
                    {reportPhase === 'shake' && (
                      <span className="notch-notify-shake inline-flex"><FileText size={18} weight="regular" /></span>
                    )}
                    {reportPhase === 'check' && (
                      <span className="notch-icon-fade-in inline-flex" style={{ color: 'var(--success)' }}><CheckCircle size={18} weight="regular" /></span>
                    )}
                    {reportPhase === 'done' && (
                      <>
                        <span className="notch-icon-fade-in inline-flex"><FileText size={18} weight="regular" /></span>
                        <span className="notch-badge-pop absolute -bottom-1 -right-1.5 flex items-center justify-center size-3 rounded-full text-[7px] font-bold text-white leading-none" style={{ background: 'var(--success)' }}>✓</span>
                      </>
                    )}
                  </span>
                )}
              </span>
            )}
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
              onClick={() => handleNavSelect('record')}
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
            style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'hidden' }}
          >
            <div style={{ pointerEvents: headerReady ? 'auto' : 'none' }}>
              <NotchHeader
                activeId={headerActiveId}
                onSelect={handleNavSelect}
                isRecording={isRecording}
                onUpload={handleUpload}
              />
            </div>

            <div
              className="relative"
              key={activeView ?? 'default'}
              style={{ animation: `notch2-expand-content ${CSS.durBase} ${CSS.easeOutCubic} both` }}
            >
              {activeView === 'settings' ? (
                <NotchSettingsView onClose={() => setActiveView('notifications')} />
              ) : activeView === 'drop' ? (
                <div className="p-4 flex flex-col" style={{ minHeight: 240 - HEADER_H }}>
                  <DropContent
                    dropPhase={dropPhase}
                    errorMessage={errorMessage}
                    fileName={droppedFile?.name ?? ''}
                    isDragging={dropPhase === 'dragging'}
                    progress={progressRef.current}
                    fileInputRef={fileInputRef}
                    onBrowse={() => fileInputRef.current?.click()}
                    onFileSelected={processFiles}
                    onDismiss={() => { send({ type: 'DISMISS_ERROR' }); setActiveView('notifications'); }}
                    onCancel={() => { send({ type: 'CANCEL_DROP' }); setActiveView('notifications'); }}
                  />
                </div>
              ) : (
                <NotchView
                  id={activeView as NavId | null}
                  onViewAllSessions={() => { send({ type: 'CLOSE' }); window.dispatchEvent(new CustomEvent('ix:open-session-history')); }}
                  onViewAllTasks={() => { send({ type: 'CLOSE' }); window.dispatchEvent(new CustomEvent('ix:open-work')); }}
                  onViewAllNotifications={() => { send({ type: 'CLOSE' }); }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );

  const notificationPopover = pillHovered && hasNotification && latestNotification && !isExpanded
    ? createPortal(
        <div
          style={{
            position: 'fixed',
            top: PILL_HEIGHT + 8,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'notch2-expand-content 150ms var(--ease-out-cubic) both',
          }}
        >
          <div
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              boxShadow: 'var(--shadow-md)',
              padding: '10px 14px',
              minWidth: 220,
              maxWidth: 320,
            }}
          >
            <p className="text-[13px] font-medium text-foreground leading-snug">{latestNotification.title}</p>
            {latestNotification.preview && (
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">{latestNotification.preview}</p>
            )}
          </div>
        </div>,
        document.body,
      )
    : null;

  return <>{scrim}{island}{notificationPopover}</>;
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

function DropContent({ dropPhase, errorMessage, fileName, isDragging, progress, fileInputRef, onBrowse, onFileSelected, onDismiss }: DropContentProps) {
  if (dropPhase === 'uploading') return <UploadingView fileName={fileName} progress={progress} />;
  if (dropPhase === 'success')   return <SuccessView />;
  if (dropPhase === 'error')     return <ErrorView message={errorMessage ?? 'An error occurred.'} onDismiss={onDismiss} />;
  return <DropZone isDragging={isDragging} onBrowse={onBrowse} inputRef={fileInputRef} onFileSelected={onFileSelected} />;
}
