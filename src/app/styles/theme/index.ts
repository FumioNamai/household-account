import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

export const lightTheme = createTheme({
  palette: {
    // primary: { main: "#2a48f3" },
    // secondary: { main: "#9147FF" },
    mode: "light",
  },
});

export const darkTheme = createTheme({
  palette: {
    // primary: { main: "#9147FF" },
    // secondary: { main: "#2a48f3" },
    mode: "dark",
  },
});
