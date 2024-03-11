import { PaletteMode, colors, createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

// OSの設定に連動させるパターン
  // export const colorTheme = (prefersDarkMode:any) =>
  // createTheme({
  //   palette: {
  //     mode:prefersDarkMode ? 'dark' : 'light',
  //   },
  // })
// console.log("colorTheme");

export const colorTheme = (mode:PaletteMode) =>
createTheme({
  palette: {
    mode:mode,
  },
})

console.log("colorThemeが呼ばれました");


// export const colorTheme = (mode:any) => createTheme({
//   palette: {
//     primary: {
//       main: colors.blue[800],
//     },
//     mode:mode,
//   },
// });

// const lightTheme = {
//   backgroundColor: "#ffffff",
//   color: "#333333",
// };

// const darkTheme = {
//   backgroundColor: "#333333",
//   color: "#ffffff",
// };

// export function colorTheme(mode) {
//   return mode === "dark" ? darkTheme : lightTheme;
// }
