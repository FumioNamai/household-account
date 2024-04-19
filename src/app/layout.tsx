import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import React, { type FC } from "react";
import { Container } from "@mui/material";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

type RootLayoutProps = {
  children: React.ReactNode;
};

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
    <html lang="ja" suppressHydrationWarning>
      {/* <html lang="ja"> */}
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={inter.className}>
        <Header />
        <Providers>
          <Container maxWidth="sm" sx={{minWidth:"375px"}}>
            <div className="h-10 mb-5">
              <ThemeToggle />
            </div>
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}
