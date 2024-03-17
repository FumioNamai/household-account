// import { PaletteMode } from "@mui/material";
// import { create } from "zustand";
// import { devtools, persist } from "zustand/middleware";

// type ModeStateType = {
//   mode: PaletteMode
//   toggleColorMode : () => void
// }

// export const useModeStore = create<ModeStateType>((set) => ({
//   mode: "light" as PaletteMode,
//   toggleColorMode: () => {
//     set((state) => ({mode: state.mode === "light" ? "dark" : "light"}));
//   },
// }))

// export const useModeStore = create<ModeStateType>()(
//     persist(
//       (set) => ({
//         mode: "dark" ? "dark" : "light",
//         toggleColorMode: () =>
//             set((state) => ({mode: state.mode === "dark" ? "light" : "dark"})),
//       }),
//       {
//         name:"mode-storage",
//       },
//     ),
// )
// console.log("store/modeが呼び出されました");
