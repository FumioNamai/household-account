"use client";
import { usePathname } from "next/navigation";
import { Box, Button, Container, createTheme } from "@mui/material";

import { ThemeProvider, CssBaseline } from "@mui/material";
// import { grey } from "@mui/material/colors";
// import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
// import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import { useMemo, useState } from "react";
import { useModeStore } from "@/store";
import ModeSwitch from "../components/modeSwitch";
import { colorTheme } from "../components/colorTheme";

//レイアウト
const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // 現在のページのパスを取得できる

  const { mode, }  = useModeStore()
  const theme = useMemo(()=>colorTheme(mode),
  [mode]
)

  // const [mode, setMode] = useState("light");
  // const theme = createTheme({
  //   palette: {
  //     ...(mode === true
  //       ? {
  //           text: {
  //             primary: grey[900],
  //             secondary: grey[800],
  //           },
  //           background: {
  //             paper: grey[100],
  //             default: grey[100],
  //           },
  //         }
  //       : {
  //           divider: grey[700],
  //           text: {
  //             primary: grey[100],
  //             secondary: grey[200],
  //           },
  //           background: {
  //             paper: grey[900],
  //             default: grey[900],
  //           },
  //           action: {
  //             active: grey[200],
  //           },
  //         }),
  //   },
  // });

  // const toggleColorMode = () => {
  //   setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  // };

  return (
      <Container maxWidth="sm">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* <Button
            sx={{ padding: 0, minWidth: "24px" }}
            onClick={toggleColorMode}
          >
            {mode === "dark" ? (
              <LightModeRoundedIcon />
            ) : (
              <NightlightRoundedIcon />
            )}
          </Button> */}
          <ModeSwitch />
          <Box sx={{ marginTop: 5, marginInline: 2 }}>{children}</Box>
        </ThemeProvider>
      </Container>
  );
};

export default SettingsLayout;
