export interface AnalyzeRequest {
  url: string;
  clipLengthSeconds?: number;
  clipCount?: number;
  language?: string;
}

export interface VideoMetadata {
  id: string;
  title: string;
  author: string;
  lengthSeconds: number;
  thumbnails: { url: string; width: number; height: number }[];
  description?: string;
  uploadDate?: string;
}

export interface TranscriptSentence {
  text: string;
  start: number;
  end: number;
  tokenCount: number;
  index: number;
}

export interface ClipHighlight {
  id: string;
  start: number;
  end: number;
  summary: string;
  hook: string;
  captionStyle: {
    preset: string;
    colors: { background: string; foreground: string; accent: string };
    animation: string;
  };
  hashtags: string[];
  keywords: string[];
  bRollIdeas: string[];
  callToAction: string;
  confidence: number;
}

export interface TranscriptInsights {
  bulletPoints: string[];
  keyTopics: string[];
  tone: string;
}

export interface AnalyzeResponse {
  metadata: VideoMetadata;
  insights: TranscriptInsights;
  highlights: ClipHighlight[];
}
