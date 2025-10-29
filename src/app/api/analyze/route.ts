import { NextResponse } from "next/server";
import { z } from "zod";
import ytdl from "ytdl-core";
import { YoutubeTranscript } from "youtube-transcript";
import { buildSentencesFromTranscript, buildTranscriptInsights, generateHighlights } from "@/lib/highlight";
import type { AnalyzeResponse } from "@/types/analyze";

export const runtime = "nodejs";
export const maxDuration = 60;

const requestSchema = z.object({
  url: z.string().url(),
  clipLengthSeconds: z.number().min(10).max(90).default(35),
  clipCount: z.number().min(1).max(6).default(3),
  language: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = requestSchema.parse({
      ...payload,
      clipLengthSeconds: payload.clipLengthSeconds ? Number(payload.clipLengthSeconds) : undefined,
      clipCount: payload.clipCount ? Number(payload.clipCount) : undefined
    });

    const videoUrl = parsed.url.trim();

    if (!ytdl.validateURL(videoUrl)) {
      return NextResponse.json({ error: "Please provide a valid YouTube video URL." }, { status: 400 });
    }

    const videoId = ytdl.getURLVideoID(videoUrl);
    const info = await ytdl.getInfo(videoUrl);

    const captions = await fetchTranscript(videoId, parsed.language);
    if (captions.length === 0) {
      return NextResponse.json(
        { error: "Transcript is not available for this video." },
        { status: 422 }
      );
    }

    const topSegments = captions.slice(0, 1200);
    const sentences = buildSentencesFromTranscript(topSegments);

    const highlights = generateHighlights(sentences, {
      clipLengthSeconds: parsed.clipLengthSeconds,
      clipCount: parsed.clipCount
    });

    const insights = buildTranscriptInsights(sentences);

    const metadata = {
      id: videoId,
      title: info.videoDetails.title,
      author: info.videoDetails.author?.name ?? "Unknown creator",
      lengthSeconds: Number(info.videoDetails.lengthSeconds),
      thumbnails: info.videoDetails.thumbnails,
      description: info.videoDetails.description ?? undefined,
      uploadDate: info.videoDetails.publishDate ?? undefined
    };

    const response: AnalyzeResponse = {
      metadata,
      insights,
      highlights
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("/api/analyze", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues.map((issue) => issue.message).join(", ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to process video. Please try another link." }, { status: 500 });
  }
}

async function fetchTranscript(videoId: string, language?: string) {
  try {
    return await YoutubeTranscript.fetchTranscript(videoId, {
      lang: language ?? "en"
    });
  } catch (error) {
    console.warn("Primary transcript fetch failed, attempting fallback", error);
    try {
      return await YoutubeTranscript.fetchTranscript(videoId);
    } catch (secondaryError) {
      console.error("Transcript fetch failed", secondaryError);
      return [];
    }
  }
}
