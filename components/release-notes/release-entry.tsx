"use client";

import { useEffect, useRef, useState } from "react";
import { Play, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ReleaseBadge } from "./release-badge";
import type { ReleaseEntry } from "./release-notes-data";

function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

function VideoFrame({ video, children }: { video?: { light: string; dark: string }; children: React.ReactNode }) {
  const isDark = useIsDark();
  const ref = useRef<HTMLVideoElement>(null);
  const resume = useRef({ time: 0, playing: false });
  const [playing, setPlaying] = useState(false);
  const src = video ? (isDark ? video.dark : video.light) : undefined;

  function toggle() {
    const el = ref.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
      {src && (
        <video
          key={src}
          ref={ref}
          src={`${src}#t=0.001`}
          muted
          loop
          playsInline
          preload="metadata"
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedMetadata={e => {
            const el = e.currentTarget;
            el.currentTime = resume.current.time;
            if (resume.current.playing) el.play();
          }}
          onTimeUpdate={e => { resume.current = { time: e.currentTarget.currentTime, playing: !e.currentTarget.paused }; }}
          className="absolute inset-0 size-full cursor-pointer object-cover"
        />
      )}
      <button
        aria-label={playing ? "Pause video" : "Play video"}
        onClick={toggle}
        className={cn(
          "absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/40 text-foreground transition-opacity hover:bg-background/60",
          playing && "pointer-events-none opacity-0"
        )}
      >
        <Play size={28} weight="fill" />
      </button>
      {children}
    </div>
  );
}

function Feedback({ className }: { className?: string }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  return (
    <div className={cn("flex gap-4", className)}>
      <button
        aria-label="Helpful"
        aria-pressed={vote === "up"}
        onClick={() => setVote(vote === "up" ? null : "up")}
        className="text-foreground transition-opacity hover:opacity-70"
      >
        <ThumbsUp size={28} weight={vote === "up" ? "fill" : "regular"} />
      </button>
      <button
        aria-label="Not helpful"
        aria-pressed={vote === "down"}
        onClick={() => setVote(vote === "down" ? null : "down")}
        className="text-foreground transition-opacity hover:opacity-70"
      >
        <ThumbsDown size={28} weight={vote === "down" ? "fill" : "regular"} />
      </button>
    </div>
  );
}

export function ReleaseEntryCard({ entry }: { entry: ReleaseEntry }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-card px-5 pt-4 pb-5">
      <header className="flex items-center gap-4">
        <div className="flex flex-1 min-w-0 flex-col gap-0.5">
          <h2 className="font-heading text-base font-medium text-foreground">{entry.heading}</h2>
          <p className="text-sm text-muted-foreground">{entry.subtitle}</p>
        </div>
        <ReleaseBadge category={entry.category} />
      </header>

      <Separator />

      {entry.hasVideo && (
        <VideoFrame video={entry.video}>
          <Feedback className="absolute bottom-8 left-1/2 -translate-x-1/2" />
        </VideoFrame>
      )}

      <div className="flex flex-col gap-2 pb-2">
        <h3 className="font-heading text-xl font-semibold text-foreground">{entry.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{entry.body}</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="w-fit rounded-sm border border-orange-600 px-2 py-1 text-xs text-orange-600 dark:border-orange-400 dark:text-orange-400">
          {entry.version}
        </span>
        {!entry.hasVideo && <Feedback />}
      </div>
    </article>
  );
}
