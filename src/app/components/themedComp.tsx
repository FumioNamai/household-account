"use client";
import { CssBaseline, ThemeProvider, } from "@mui/material";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
// import { useModeStore } from "@/store/mode";
import { colorTheme } from "./colorTheme";
import { useTheme } from "next-themes";
import { darkTheme, lightTheme } from "../styles/theme";

type Props = {
  children?: ReactNode;
};

export const ThemedComp: FC<Props> = ({ children }) => {
  // const mode = useModeStore((state) => state.mode);
  // const theme = useMemo(() => colorTheme(mode), [mode]);

  const {resolvedTheme} = useTheme()
  const [currentTheme, setCurrentTheme] = useState(darkTheme)

  useEffect(() => {
    resolvedTheme === "light"
    ? setCurrentTheme(lightTheme)
    : setCurrentTheme(darkTheme)
  },[resolvedTheme])

  // const data = JSON.parse(localStorage.getItem("mode-storage"))
  // console.log(data.state.mode);

  // OSの設定に連動させるパターン
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // const theme = useMemo(() => colorTheme(prefersDarkMode), [prefersDarkMode]);

  // const theme = colorTheme(prefersDarkMode)

  // const [mode, setMode] = useState<PaletteMode>('light')

  // const colorMode = useMemo(() => ({
  //   toggleColorMode: () =>
  //   {
  //     setMode((prevMode) => (prevMode === "light" ? 'dark' :'light' ))
  //   },
  // })
  // ,[]
  // )

  // const theme = useMemo(() =>
  // createTheme({
  //   palette: {
  //     mode: mode as PaletteMode,
  //   },
  // }),
  // [mode]
  // )


  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {/* <ModeSwitch /> */}
      {children}
    </ThemeProvider>
  );


};
