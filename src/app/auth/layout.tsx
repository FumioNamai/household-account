"use client";
import { usePathname } from "next/navigation";
import { Box, Button, Container, PaletteMode, createTheme, useMediaQuery } from "@mui/material";

import { ThemeProvider, CssBaseline } from "@mui/material";

import { useMemo, useState } from "react";
import { useModeStore } from "@/store/mode";
import ModeSwitch from "../components/modeSwitch";
import { colorTheme } from "../components/colorTheme";

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

// const theme = useMemo(() =>
// createTheme({
//   palette: {
//     mode: mode as PaletteMode,
//   },
// }),
// [mode]
// )

  return (
      <Container maxWidth="sm">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* <ModeSwitch /> */}
          <Box sx={{ marginTop: 5, marginInline: 2 }}>{children}</Box>
        </ThemeProvider>
      </Container>
  );
};

export default SettingsLayout;
