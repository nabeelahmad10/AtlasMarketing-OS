import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUXE CRM | AI-Native Marketing & Engagement Platform",
  description: "Intelligently segment shoppers, craft personalized campaigns, and track performance with AI-powered marketing tools built for modern D2C brands.",
  keywords: "CRM, marketing, AI, segmentation, campaigns, D2C, engagement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
