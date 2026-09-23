'use client';

import { Copy, PencilSimple, ArrowCounterClockwise, ThumbsUp, ThumbsDown } from '@phosphor-icons/react';

interface MessageToolbarProps {
  onCopy?: () => void;
  onEdit?: () => void;
  onRepeat?: () => void;
  onThumbsUp?: () => void;
  onThumbsDown?: () => void;
  className?: string;
}

const btn = 'p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer';

export function MessageToolbar({
  onCopy,
  onEdit,
  onRepeat,
  onThumbsUp,
  onThumbsDown,
  className = '',
}: MessageToolbarProps) {
  return (
    <div
      className={`flex items-center gap-0.5 animate-in fade-in duration-300 ${className}`}
      style={{ animationDelay: '200ms', animationFillMode: 'both' }}
    >
      <button onClick={onCopy}       className={btn} aria-label="Copy">        <Copy size={15} /></button>
      <button onClick={onEdit}       className={btn} aria-label="Edit">        <PencilSimple size={15} /></button>
      <button onClick={onRepeat}     className={btn} aria-label="Retry">       <ArrowCounterClockwise size={15} /></button>
      <button onClick={onThumbsUp}   className={btn} aria-label="Good response">  <ThumbsUp size={15} /></button>
      <button onClick={onThumbsDown} className={btn} aria-label="Bad response"> <ThumbsDown size={15} /></button>
    </div>
  );
}
