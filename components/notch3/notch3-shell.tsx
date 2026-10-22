'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { StopCircle, Bell, CalendarBlank, ListChecks } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useNotchMachine } from '@/components/notch2/notch-hook';
import { DropZone, UploadingView, SuccessView, ErrorView, validateFile } from '@/components/notch2/notch-drop';
import { Notch3Header, type NavId3 } from './notch3-nav';
import { Notch3View, VIEW_HEIGHTS_3 } from './notch3-views';
import { CSS, SPRING_GROW_DURATION_MS } from '@/lib/motion';

// ── Geometry ──────────────────────────────────────────────────────────────────
const PILL_WIDTH        = 180;
const PILL_HEIGHT       = 36;
const PILL_RADIUS       = '0 0 12px 12px';
const PANEL_WIDTH       = 680;
const PANEL_RADIUS      = '0 0 24px 24px';
const HEADER_H          = 44;
const DIVIDER_GAP_PX    = 8;
const CONTENT_GAP_PX    = 16;
const PANEL_PADDING_PX  = 16;
const DEFAULT_CONTENT_H = 320;
const DROP_CONTENT_H    = 160;
const ALERT_CARD_H      = 64;
const SUCCESS_LINGER_MS = 1200;

type ActiveView3 = NavId3 | 'drop';

export function Notch3Shell() {
  const [mounted, setMounted]               = useState(false);
  const [activeView, setActiveView]         = useState<ActiveView3>('notifications');
  const [isRecording, setIsRecording]       = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [headerReady, setHeaderReady]       = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [notifyKey, setNotifyKey]           = useState(0);
  const [hasCalendarEvent, setHasCalendarEvent] = useState(false);
  const [calendarKey, setCalendarKey]           = useState(0);
  const [hasTaskAlert, setHasTaskAlert]         = useState(false);
  const [taskKey, setTaskKey]                   = useState(0);
  const [droppedFile, setDroppedFile]       = useState<File | null>(null);

  const containerRef     = useRef<HTMLDivElement>(null);
  const recordingTimer   = useRef<ReturnType<typeof setInterval> | null>(null);
  const headerReadyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const dragDepthRef     = useRef(0);

  const { state, send, progressRef } = useNotchMachine();
  const { notch, dropPhase, errorMessage } = state;

  useEffect(() => { setMounted(true); }, []);

  const isExpanded = notch === 'expanded';

  // Switch to drop view when a drag/upload is active
  useEffect(() => {
    if (dropPhase === 'dragging' || dropPhase === 'uploading') {
      setActiveView('drop');
    }
  }, [dropPhase]);

  // Block tooltips during spring-grow; reset default view on close
  useEffect(() => {
    if (!isExpanded) {
      setActiveView('notifications');
      setHeaderReady(false);
      if (headerReadyTimer.current) clearTimeout(headerReadyTimer.current);
    } else {
      setHeaderReady(false);
      if (headerReadyTimer.current) clearTimeout(headerReadyTimer.current);
      headerReadyTimer.current = setTimeout(() => setHeaderReady(true), SPRING_GROW_DURATION_MS);
    }
  }, [isExpanded]);

  // New notification event — only animate when collapsed
  useEffect(() => {
    const handler = () => {
      if (isExpanded) return;
      setHasNotification(true);
      setNotifyKey(k => k + 1);
    };
    window.addEventListener('ix:new-notification', handler);
    return () => window.removeEventListener('ix:new-notification', handler);
  }, [isExpanded]);

  // Calendar event alert
  useEffect(() => {
    const handler = () => {
      if (isExpanded) return;
      setHasCalendarEvent(true);
      setCalendarKey(k => k + 1);
    };
    window.addEventListener('ix:appointment-reminder', handler);
    return () => window.removeEventListener('ix:appointment-reminder', handler);
  }, [isExpanded]);

  // Task alert
  useEffect(() => {
    const handler = () => {
      if (isExpanded) return;
      setHasTaskAlert(true);
      setTaskKey(k => k + 1);
    };
    window.addEventListener('ix:task-alert', handler);
    return () => window.removeEventListener('ix:task-alert', handler);
  }, [isExpanded]);

  // Clear all alerts when the panel closes
  useEffect(() => {
    if (!isExpanded) {
      setHasNotification(false);
      setHasTaskAlert(false);
      setHasCalendarEvent(false);
    }
  }, [isExpanded]);

  // Linger on success then close
  useEffect(() => {
    if (dropPhase !== 'success') return;
    toast.success('Upload successful', { description: droppedFile?.name });
    const t = setTimeout(() => {
      send({ type: 'CLOSE' });
      setDroppedFile(null);
    }, SUCCESS_LINGER_MS);
    return () => clearTimeout(t);
  }, [dropPhase, droppedFile, send]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recordingTimer.current)   clearInterval(recordingTimer.current);
      if (headerReadyTimer.current) clearTimeout(headerReadyTimer.current);
    };
  }, []);

  // ── Window drag listeners ─────────────────────────────────────────────────
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

  // ── Close on outside click ────────────────────────────────────────────────
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

  // ── Nav handler ───────────────────────────────────────────────────────────
  const handleNavSelect = useCallback((id: NavId3) => {
    if (id === 'record') {
      if (isRecording) {
        if (recordingTimer.current) clearInterval(recordingTimer.current);
        recordingTimer.current = null;
        setRecordingSeconds(0);
        setIsRecording(false);
        toast.success('Recording stopped');
      } else {
        setRecordingSeconds(0);
        recordingTimer.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
        setIsRecording(true);
        send({ type: 'CLOSE' });
      }
      return;
    }
    if (id === 'knowledge') {
      setActiveView('drop');
      send({ type: 'SHOW_DROP' });
      return;
    }
    setActiveView(id);
    if (dropPhase !== 'idle') send({ type: 'CANCEL_DROP' });
  }, [isRecording, dropPhase, send]);

  if (!mounted) return null;

  // ── Sizing ────────────────────────────────────────────────────────────────
  const contentH = activeView === 'drop'
    ? DROP_CONTENT_H
    : (activeView === 'notifications' && hasNotification) ||
      (activeView === 'tasks'         && hasTaskAlert)    ||
      (activeView === 'calendar'      && hasCalendarEvent)
    ? ALERT_CARD_H
    : (VIEW_HEIGHTS_3[activeView as NavId3] ?? DEFAULT_CONTENT_H);
  const panelH = HEADER_H + DIVIDER_GAP_PX + 1 + CONTENT_GAP_PX + contentH + PANEL_PADDING_PX;

  const width  = isExpanded ? PANEL_WIDTH : PILL_WIDTH;
  const height = isExpanded ? panelH      : PILL_HEIGHT;
  const radius = isExpanded ? PANEL_RADIUS : PILL_RADIUS;

  const expandEasing   = `${CSS.easeSpringGrow} ${CSS.durSpringGrow}`;
  const collapseEasing = `${CSS.easeShrink} ${CSS.durShrink}`;
  const sizeEasing     = isExpanded ? expandEasing : collapseEasing;

  const borderColour = !isExpanded && isRecording ? 'var(--destructive)' : 'var(--border)';

  const mm = String(Math.floor(recordingSeconds / 60)).padStart(2, '0');
  const ss = String(recordingSeconds % 60).padStart(2, '0');

  // The active nav id to highlight — null when on drop view
  const headerActiveId: NavId3 | null = activeView === 'drop' ? null : activeView as NavId3;

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
          position: 'relative',
          width, height, borderRadius: radius,
          overflow: 'hidden',
          pointerEvents: 'auto',
          background: 'var(--surface-raised)',
          borderTop: 'none',
          borderRight:  `1px solid ${borderColour}`,
          borderBottom: `1px solid ${borderColour}`,
          borderLeft:   `1px solid ${borderColour}`,
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
        {/* ── Collapsed pill ── */}
        {!isExpanded && !isRecording && (
          <button
            type="button"
            aria-label="Open panel"
            onClick={() => {
              // Open directly into the alerted view, left-to-right priority
              // matching the icon order: notifications, calendar, tasks.
              if (hasNotification) setActiveView('notifications');
              else if (hasCalendarEvent) setActiveView('calendar');
              else if (hasTaskAlert) setActiveView('tasks');
              send({ type: 'OPEN' });
            }}
            className="flex items-center justify-center w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset text-foreground"
            style={{ background: 'transparent' }}
          >
            {(hasNotification || hasTaskAlert || hasCalendarEvent) ? (
              <span className="flex items-center gap-2.5">
                {hasNotification && (
                  <span key={notifyKey} className="relative inline-flex items-center justify-center">
                    <svg aria-hidden="true" viewBox="0 0 12 16" width="12" height="16" className="n3-sound-line-left absolute right-full mr-0.5 text-muted-foreground" fill="none">
                      {/* small arc, closest to the bell */}
                      <path d="M10.5 5C9.6 6 9.2 6.9 9.2 8C9.2 9.1 9.6 10 10.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      {/* large arc, furthest from the bell */}
                      <path d="M6.5 1.5C4.3 3.8 3.2 5.8 3.2 8C3.2 10.2 4.3 12.2 6.5 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    <span className="n3-bell-pop n3-bell-ring inline-flex text-foreground">
                      <Bell size={20} weight="regular" />
                    </span>
                    <svg aria-hidden="true" viewBox="0 0 12 16" width="12" height="16" className="n3-sound-line-right absolute left-full ml-0.5 text-muted-foreground" fill="none">
                      {/* small arc, closest to the bell */}
                      <path d="M1.5 5C2.4 6 2.8 6.9 2.8 8C2.8 9.1 2.4 10 1.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      {/* large arc, furthest from the bell */}
                      <path d="M5.5 1.5C7.7 3.8 8.8 5.8 8.8 8C8.8 10.2 7.7 12.2 5.5 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </span>
                )}
                {hasCalendarEvent && (
                  <span key={calendarKey} className="n3-calendar-drop inline-flex text-foreground">
                    <CalendarBlank size={20} weight="regular" />
                  </span>
                )}
                {hasTaskAlert && (
                  <span key={taskKey} className="n3-task-stamp inline-flex text-foreground">
                    <ListChecks size={20} weight="regular" />
                  </span>
                )}
              </span>
            ) : (
              <span className="block rounded-full bg-current opacity-40" style={{ width: 24, height: 4 }} />
            )}
          </button>
        )}

        {/* ── Recording pill ── */}
        {!isExpanded && isRecording && (
          <div className="flex items-center justify-between w-full h-full px-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-destructive animate-pulse shrink-0" />
              <span className="text-[13px] font-medium tabular-nums text-foreground">{mm}:{ss}</span>
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
          <div className="flex flex-col" style={{ padding: `0 0 ${PANEL_PADDING_PX}px 0` }}>
            <div style={{ pointerEvents: headerReady ? 'auto' : 'none' }}>
              <Notch3Header
                activeId={headerActiveId}
                onSelect={handleNavSelect}
                isRecording={isRecording}
              />
            </div>

            {/* Divider */}
            <div style={{
              marginTop: DIVIDER_GAP_PX,
              marginLeft: PANEL_PADDING_PX,
              marginRight: PANEL_PADDING_PX,
              height: 1,
              borderRadius: 999,
              background: 'var(--border)',
            }} />

            {/* Content */}
            <div
              key={activeView}
              style={{
                marginTop: CONTENT_GAP_PX,
                marginLeft: PANEL_PADDING_PX,
                marginRight: PANEL_PADDING_PX,
                height: contentH,
                animation: `notch2-expand-content ${CSS.durBase} ${CSS.easeOutCubic} both`,
              }}
            >
              {activeView === 'drop' ? (
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
              ) : (
                <Notch3View
                  id={activeView as NavId3}
                  hasNotification={hasNotification}
                  hasTaskAlert={hasTaskAlert}
                  hasCalendarEvent={hasCalendarEvent}
                />
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

function DropContent({ dropPhase, errorMessage, fileName, isDragging, progress, fileInputRef, onBrowse, onFileSelected, onDismiss }: DropContentProps) {
  if (dropPhase === 'uploading') return <UploadingView fileName={fileName} progress={progress} />;
  if (dropPhase === 'success')   return <SuccessView />;
  if (dropPhase === 'error')     return <ErrorView message={errorMessage ?? 'An error occurred.'} onDismiss={onDismiss} />;
  return <DropZone isDragging={isDragging} onBrowse={onBrowse} inputRef={fileInputRef} onFileSelected={onFileSelected} />;
}
