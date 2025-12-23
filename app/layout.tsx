import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BharatBites - The Indian Food Discovery Game",
  description: "Guess the origin state of iconic Indian dishes!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GameProvider>
          <main className="min-h-screen bg-stone-50 text-stone-900">
            {children}
          </main>
        </GameProvider>
      </body>
    </html>
  );
}
