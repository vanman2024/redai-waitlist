import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Red Seal Hub - Join the Waitlist | AI-Powered Red Seal Exam Prep",
  description: "Join the Red Seal Hub waitlist! AI-powered study platform for all 54 Red Seal trades. Personalized exam prep, practice quizzes, and job connections. Beta launching January 2026.",
  keywords: ["Red Seal", "trades certification", "exam prep", "AI study tool", "apprentice training", "skilled trades"],
  authors: [{ name: "Red Seal Hub" }],
  openGraph: {
    title: "Red Seal Hub - AI-Powered Exam Prep for Skilled Trades",
    description: "Join the waitlist for Red Seal Hub! Personalized AI study partner for all 54 Red Seal trades. Beta launching January 2026.",
    url: "https://waitlist.redsealhub.com",
    siteName: "Red Seal Hub",
    images: [
      {
        url: "/og-image.png", // You'll want to add this image
        width: 1200,
        height: 630,
        alt: "Red Seal Hub - AI-Powered Trade Certification Prep",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Seal Hub - Join the Waitlist",
    description: "AI-powered exam prep for all 54 Red Seal trades. Beta launching January 2026.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
