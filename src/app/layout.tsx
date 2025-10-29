import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "ClipForge | AI Shorts Agent",
  description:
    "Generate viral-ready short video ideas, hooks, and captions from any YouTube or podcast link using AI-first analysis."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2a6e,#090b1a)]" aria-hidden />
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
