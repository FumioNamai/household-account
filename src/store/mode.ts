import { PaletteMode } from "@mui/material";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type ModeStateType = {
  mode: PaletteMode
  toggleColorMode : () => void
}

// export const useModeStore = create<ModeStateType>((set) => ({
//   mode: "light" as PaletteMode,
//   toggleColorMode: () => {
//     set((state) => ({mode: state.mode === "light" ? "dark" : "light"}));
//   },
// }))

//データを永続化
// const data = JSON.parse(localStorage.getItem("mode-storage"))
// console.log(data.state.mode);
export const useModeStore = create<ModeStateType>()(
    persist(
      (set) => ({
        mode: "dark" ? "dark" : "light",
        // mode: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("mode-storage") ?? '{"state": {"mode": "dark"}}').state.mode : "dark",
        toggleColorMode: () =>
            set((state) => ({mode: state.mode === "dark" ? "light" : "dark"})),
      }),
      {
        name:"mode-storage",
      },
    ),
)
console.log("store/modeが呼び出されました");
