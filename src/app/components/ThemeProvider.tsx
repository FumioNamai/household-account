"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { ThemedComp } from "@/app/components/ThemedComp";



export const Providers: FC<PropsWithChildren> = ({ children }) => {

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <NextThemesProvider attribute="class">
      <ThemedComp>
        {children}
      </ThemedComp>
    </NextThemesProvider>
  );
};
