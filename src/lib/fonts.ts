import { Geist, Geist_Mono } from "next/font/google";

// Shared font instances so every root layout (the localized site and the
// `/s/*` deep-link tree) applies the same CSS variables on <html>.
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const fontVariables = [geistSans.variable, geistMono.variable].join(" ");
