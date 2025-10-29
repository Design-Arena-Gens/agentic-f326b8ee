'use client';

import { useCallback, useState } from "react";
import type { ClipHighlight } from "@/types/analyze";
import { formatDuration } from "@/lib/format";

interface HighlightCardProps {
  highlight: ClipHighlight;
  index: number;
}

export function HighlightCard({ highlight, index }: HighlightCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const payload = [
      `Clip ${index + 1}: ${formatDuration(highlight.start)} - ${formatDuration(highlight.end)}`,
      `Hook: ${highlight.hook}`,
      `Summary: ${highlight.summary}`,
      `Call-to-Action: ${highlight.callToAction}`,
      `Caption Style: ${highlight.captionStyle.preset} (${highlight.captionStyle.animation})`,
      `Hashtags: ${highlight.hashtags.join(" ")}`,
      `B-roll ideas: ${highlight.bRollIdeas.join(", ")}`
    ].join("\n");

    navigator.clipboard.writeText(payload).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [highlight, index]);

  return (
    <div className="glass-panel gradient-border relative flex flex-col gap-4 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Clip {index + 1}</p>
          <h3 className="mt-1 font-display text-xl text-white">{highlight.hook}</h3>
        </div>
        <span className="rounded-full bg-primary-500/20 px-3 py-1 text-xs font-semibold text-primary-200">
          {Math.max(0, Math.round(highlight.confidence * 100))}% match
        </span>
      </div>

      <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-2">
        <div className="rounded-lg bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Timeline</p>
          <p className="mt-1 font-medium text-white">
            {formatDuration(highlight.start)} → {formatDuration(highlight.end)}
          </p>
          <p className="mt-2 text-slate-300">{highlight.summary}</p>
        </div>

        <div className="rounded-lg bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Caption Style</p>
          <p className="mt-2 font-semibold text-white">{highlight.captionStyle.preset}</p>
          <p className="text-xs text-slate-400">Animation: {highlight.captionStyle.animation}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-200">
            <span className="inline-flex h-3 w-3 rounded-full" style={{ background: highlight.captionStyle.colors.background }} />
            <span className="inline-flex h-3 w-3 rounded-full" style={{ background: highlight.captionStyle.colors.foreground }} />
            <span className="inline-flex h-3 w-3 rounded-full" style={{ background: highlight.captionStyle.colors.accent }} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {highlight.hashtags.map((tag) => (
          <span key={tag} className="rounded-full bg-primary-500/10 px-3 py-1 text-primary-100">
            {tag}
          </span>
        ))}
      </div>

      <div className="rounded-lg bg-slate-900/70 p-4 text-sm text-slate-200">
        <p className="text-xs uppercase tracking-wide text-slate-400">B-roll & CTA</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          {highlight.bRollIdeas.map((idea) => (
            <li key={idea}>{idea}</li>
          ))}
        </ul>
        <p className="mt-2 font-medium text-primary-100">{highlight.callToAction}</p>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
        >
          {copied ? "Copied" : "Copy clip brief"}
        </button>
      </div>
    </div>
  );
}
