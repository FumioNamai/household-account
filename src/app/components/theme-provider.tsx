"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { FC, PropsWithChildren } from "react";
import { ThemedComp } from "./themedComp";

export const Providers: FC<PropsWithChildren> = ({ children }) => {

  return (
    <NextThemesProvider attribute="class">
      <ThemedComp>
        {children}
      </ThemedComp>
    </NextThemesProvider>
  );
};
