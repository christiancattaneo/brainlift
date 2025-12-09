import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Business Brainlift Grader | Alpha Founders Academy",
  description: "AI-powered grading for Business Brainlift submissions. Evaluate viability, thoroughness, and executability of teen founder business plans.",
  keywords: ["business plan", "grading", "entrepreneurship", "teen founders", "Alpha Founders Academy"],
  openGraph: {
    title: "Business Brainlift Grader",
    description: "AI-powered grading for teen founder business plans",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
