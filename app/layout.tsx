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
  title: "Red Seal Hub - Join the Waitlist | AI-Powered Skilled Trades Platform",
  description: "Join the Red Seal Hub waitlist! Complete AI-powered platform for skilled trades - exam prep for students, job matching for employers, immigration pathways for international workers, and mentorship. Beta launching January 2026.",
  keywords: ["Red Seal", "skilled trades", "trades certification", "exam prep", "apprentice jobs", "immigration consultant", "international workers", "Red Seal immigration", "trade jobs Canada", "skilled worker immigration"],
  authors: [{ name: "Red Seal Hub" }],
  openGraph: {
    title: "Red Seal Hub - AI-Powered Skilled Trades Platform",
    description: "Complete platform for skilled trades: AI exam prep, employer job matching, immigration pathways, and mentorship. For students, employers, immigration consultants, and international workers.",
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
    description: "Complete AI-powered platform for skilled trades: exam prep, job matching, immigration pathways, and mentorship.",
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
