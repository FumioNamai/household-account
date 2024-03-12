import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { SnackbarProvider } from '@/providers/context-provider'
import Header from "./components/header";
import { ThemedComp } from "./components/themedComp";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "N式家計簿",
  description: "家計簿",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <ThemedComp>
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </ThemedComp>
    </html>
  );
}
