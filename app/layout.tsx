import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroPulse Ops — Autonomous Drone Command Dashboard",
  description: "Tactical 3D Command & Control Dashboard for Autonomous Drone Fleet Operations",
  keywords: "drone operations, UAV command center, Smart India Hackathon, AeroPulse, tactical dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        {/* Google Fonts — Inter + JetBrains Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap"
        />
        {/* MapLibre GL CSS */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/maplibre/maplibre-gl.css" />
      </head>
      <body className="h-full w-full overflow-hidden bg-[#0a0a0a] text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
