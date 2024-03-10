"use client";
import { usePathname } from "next/navigation";
import { Box, Container, useMediaQuery } from "@mui/material";

import { ThemeProvider, CssBaseline } from "@mui/material";

import { useMemo, } from "react";
import { useModeStore } from "@/store/mode";
import { colorTheme } from "../components/colorTheme";
import { ThemedComp } from "../components/themedComp";

//レイアウト
const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // 現在のページのパスを取得できる

  const mode = useModeStore((state) => (state.mode));
  const theme = useMemo(()=>colorTheme(mode),
  [mode]
  )

    // OSの設定に連動させるパターン
    // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    // const theme = useMemo(() => colorTheme(prefersDarkMode), [prefersDarkMode]);

  return (
    <ThemedComp>
      <Container maxWidth="sm">
        {/* <ThemeProvider theme={theme}>
          <CssBaseline /> */}
          <Box sx={{ marginTop: 5, marginInline: 2 }}>{children}</Box>
        {/* </ThemeProvider> */}
      </Container>
    </ThemedComp>
  );
};

export default SettingsLayout;
