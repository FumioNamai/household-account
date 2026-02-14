import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import React from "react";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Container, CssBaseline } from "@mui/material";

import { Providers } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "N式家計簿",
  description: "家計簿",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <Providers>
            <CssBaseline />
            <Header />
            <Container maxWidth="sm" sx={{ minWidth: "375px" }}>
              <div className="h-10 mb-5">
                <ThemeToggle />
              </div>
              {children}
            </Container>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
