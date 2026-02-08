"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { darkTheme, lightTheme } from "../styles/theme";

export const ThemedComp: FC<PropsWithChildren> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const theme = resolvedTheme === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
