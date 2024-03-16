import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { SnackbarProvider } from '@/providers/context-provider'
import Header from "./components/header";
// import { ThemedComp } from "./components/themedComp";
// import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
// import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
// import { ThemeProvider as PreferredThemeProvider } from "next-themes";
import { Providers } from "./components/theme-provider";
import React, { type FC } from "react";
import { Box } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });


type RootLayoutProps = {
  children: React.ReactNode;
}

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
    // <html lang="ja" suppressContentEditableWarning>
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={inter.className}>
        <Header />
        <Providers>
          <Box height={40} marginBlock="20px">
        <ThemeToggle />
          </Box>
          {children}
        </Providers>
      </body>
    </html>
  );
}
