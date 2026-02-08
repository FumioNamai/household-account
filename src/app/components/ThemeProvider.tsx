"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { FC, PropsWithChildren } from "react";
import { ThemedComp } from "@/app/components/ThemedComp";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <ThemedComp>{children}</ThemedComp>
    </NextThemesProvider>
  );
};
