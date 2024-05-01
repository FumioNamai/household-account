"use client";

import { CssBaseline, ThemeProvider, } from "@mui/material";
import { FC, ReactNode, useEffect,useState } from "react";
import { useTheme } from "next-themes";
import { darkTheme, lightTheme } from "../styles/theme";

type Props = { children?: ReactNode };

export const ThemedComp: FC<Props> = ({ children }) => {

  const {resolvedTheme} = useTheme()
  const [currentTheme, setCurrentTheme] = useState(darkTheme)

  useEffect(() => {
    resolvedTheme === "light"
    ? setCurrentTheme(lightTheme)
    : setCurrentTheme(darkTheme)
  },[resolvedTheme])

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
