'use client';

import { useCallback, useMemo, useState } from "react";
import { HighlightCard } from "@/components/HighlightCard";
import { VideoSummary } from "@/components/VideoSummary";
import type { AnalyzeResponse } from "@/types/analyze";

const DEFAULT_CLIP_LENGTH = 35;
const DEFAULT_CLIP_COUNT = 3;
const EXAMPLE_URL = "https://www.youtube.com/watch?v=6n3pFFPSlW4";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [clipLength, setClipLength] = useState(DEFAULT_CLIP_LENGTH);
  const [clipCount, setClipCount] = useState(DEFAULT_CLIP_COUNT);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalyzeResponse[]>([]);

  const handleSubmit = useCallback(async () => {
    if (!url) {
      setError("Paste a YouTube link to get started.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          clipLengthSeconds: clipLength,
          clipCount,
          language: language || undefined
        })
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Unable to analyze video");
      }

      const payload = (await response.json()) as AnalyzeResponse;
      setResult(payload);
      setAnalysisHistory((history) => [payload, ...history].slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [url, clipLength, clipCount, language]);

  const handleExample = useCallback(() => {
    setUrl(EXAMPLE_URL);
    setClipLength(32);
    setClipCount(3);
    setLanguage("en");
  }, []);

  const hasResult = !!result;

  const exportClipSheet = useCallback(() => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${result.metadata.title.replace(/[^a-z0-9]+/gi, "-")}-clip-brief.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(href);
  }, [result]);

  const previousAnalyses = useMemo(() => analysisHistory.slice(1), [analysisHistory]);

  return (
    <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-5 py-16 md:px-12">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1 text-xs uppercase tracking-[0.4em] text-slate-300">
          AI shortform director
        </span>
        <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">
          Transform any long-form video into viral-ready shorts concepts in seconds.
        </h1>
        <p className="mt-4 text-balance text-lg text-slate-300">
          Paste a YouTube or podcast link and let ClipForge surface hooks, timestamps, captions, and CTAs engineered for Shorts, TikTok, and Reels.
        </p>
      </header>

      <section className="glass-panel gradient-border flex flex-col gap-6 rounded-3xl p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <label className="flex-1 text-sm">
            <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-400">Video URL</span>
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-base text-white outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/40"
            />
          </label>
          <button
            onClick={handleExample}
            className="mt-2 rounded-xl border border-primary-500/40 px-4 py-3 text-sm font-semibold text-primary-200 transition hover:border-primary-400 hover:text-primary-100"
          >
            Load example
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm">
            <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-400">Clip length (seconds)</span>
            <input
              type="number"
              min={10}
              max={90}
              value={clipLength}
              onChange={(event) => setClipLength(Number(event.target.value))}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-3 text-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/40"
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-400">Number of clips</span>
            <input
              type="number"
              min={1}
              max={6}
              value={clipCount}
              onChange={(event) => setClipCount(Number(event.target.value))}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-3 text-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/40"
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-400">Transcript language (optional)</span>
            <input
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              placeholder="en"
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-3 text-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/40"
            />
          </label>
        </div>

        {error && <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-200">{error}</p>}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            ClipForge analyses transcripts locally – no external LLM keys required.
          </p>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Analyzing..." : "Generate clips"}
          </button>
        </div>
      </section>

      {loading && (
        <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-slate-300">
          <p>Fetching transcript, scoring hooks, and drafting briefs…</p>
          <p className="mt-2 text-xs text-slate-500">This usually takes 10-15 seconds depending on video length.</p>
        </div>
      )}

      {hasResult && result && (
        <>
          <VideoSummary data={result} />

          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-white">Top hooks curated for Shorts</h2>
            <button
              onClick={exportClipSheet}
              className="rounded-full border border-primary-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-100 transition hover:border-primary-300 hover:text-primary-50"
            >
              Export clip sheet
            </button>
          </div>

          {result.highlights.length > 0 ? (
            <div className="grid gap-6">
              {result.highlights.map((highlight, index) => (
                <HighlightCard key={highlight.id} highlight={highlight} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-slate-400">
              We couldn&apos;t discover strong hook moments automatically. Try reducing the clip length or analyze another video.
            </div>
          )}
        </>
      )}

      {previousAnalyses.length > 0 && (
        <section className="mb-12 rounded-3xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="font-display text-xl text-white">Recent analyses</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
            {previousAnalyses.map((entry) => (
              <button
                key={entry.metadata.id}
                onClick={() => setResult(entry)}
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left transition hover:border-primary-400"
              >
                <p className="font-medium text-slate-100">{entry.metadata.title}</p>
                <p className="text-xs text-slate-500">{entry.metadata.author}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      <footer className="pb-10 text-center text-xs text-slate-500">
        Built with an emphasis on highlight discovery, pacing, and retention-driven storytelling.
      </footer>
    </main>
  );
}
