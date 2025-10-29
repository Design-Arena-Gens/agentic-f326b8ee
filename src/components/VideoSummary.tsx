'use client';

import type { AnalyzeResponse } from "@/types/analyze";
import { formatDuration } from "@/lib/format";
import Image from "next/image";

interface VideoSummaryProps {
  data: AnalyzeResponse;
}

export function VideoSummary({ data }: VideoSummaryProps) {
  const { metadata, insights } = data;
  const thumbnail = metadata.thumbnails.slice().sort((a, b) => b.width - a.width)[0];

  return (
    <section className="glass-panel gradient-border grid gap-8 rounded-3xl p-8 lg:grid-cols-[320px_1fr]">
      <div className="overflow-hidden rounded-2xl border border-white/10">
        {thumbnail ? (
          <Image
            src={thumbnail.url}
            alt={metadata.title}
            width={thumbnail.width}
            height={thumbnail.height}
            className="h-full w-full object-cover"
            priority
          />
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center bg-slate-900 text-slate-500">
            No thumbnail
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Analysis ready</p>
          <h2 className="font-display text-3xl text-white">{metadata.title}</h2>
          <p className="text-sm text-slate-300">
            {metadata.author} • {formatDuration(metadata.lengthSeconds)} • Uploaded {metadata.uploadDate ?? "unknown"}
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          {insights.bulletPoints.map((point, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-900/70 p-4 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-500">Key insight #{idx + 1}</p>
              <p className="mt-1 text-slate-100">{point}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {insights.keyTopics.map((topic) => (
            <span key={topic} className="rounded-full bg-primary-500/10 px-3 py-1 text-primary-100">
              {topic}
            </span>
          ))}
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          Tone detected: <span className="ml-2 rounded-full bg-primary-500/10 px-2 py-1 text-primary-100">{insights.tone}</span>
        </p>
      </div>
    </section>
  );
}
