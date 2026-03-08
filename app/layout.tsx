import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Aura from "@/components/Aura";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-plus-jakarta',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: "DevLog - Developer Productivity Tracker",
  description: "Track your learning, projects and resources in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="flex font-sans min-h-screen bg-[#050505] text-zinc-100 overflow-x-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-[#050505]">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.03),transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.01] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>
        <Sidebar />
        <main className="flex-1 p-10 min-h-screen relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
