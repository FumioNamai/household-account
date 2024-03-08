import { PaletteMode, colors, createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

// export const colorTheme = (mode:any) => createTheme({
  // palette: {
  //   ...(mode === "light"
  //     ? {
  //         text: {
  //           primary: grey[900],
  //           secondary: grey[800],
  //         },
  //         background: {
  //           paper: grey[100],
  //           default: grey[100],
  //         },
  //       }
  //     : {
  //         divider: grey[700],
  //         text: {
  //           primary: grey[100],
  //           secondary: grey[200],
  //         },
  //         background: {
  //           paper: grey[900],
  //           default: grey[900],
  //         },
  //         action: {
  //           active: grey[200],
  //         },
  //       }),
  // },


export const colorTheme = (mode:PaletteMode) =>
createTheme({
  palette: {
    mode:mode,
  },
})


// export const colorTheme = (mode:any) => createTheme({
//   palette: {
//     primary: {
//       main: colors.blue[800],
//     },
//     mode:mode,
//   },
// });
