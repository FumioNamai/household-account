import { PaletteMode, createTheme } from "@mui/material"

export const colorTheme = (mode:PaletteMode) =>
createTheme({
  palette: {
    mode: mode === "light" ? "light" :"dark",
  },
})
