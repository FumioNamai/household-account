import { Database } from "@/lib/database.types";
import { PaletteMode } from "@mui/material";

// Zustand Reactの状態管理ライブラリ
import { create } from "zustand";
import { persist } from "zustand/middleware";

// プロフィール情報を状態管理に格納する⇒どこでもプロフィール情報を取得できるようになる
type ProfileType = Database['public']['Tables']['profiles']['Row']

type StateType = {
  user : ProfileType
  setUser : (payload: ProfileType) => void
}

export const useStore = create<StateType>((set) => ({
  // 初期値
  user: { id:'', email:'', name:'', introduce:'', avatar_url:''},
  setUser:(payload) => set({user:payload}),
}))

type TaxStateType = {
  tax : boolean
  setTax: () => void
}

export const useTaxStore = create<TaxStateType>((set) => ({
  tax: true,
  setTax: () => set(state => ({ tax : !state.tax })),
  // handleTax: (event) => {
  //   const isChecked = event.target.checked
  //   set( isChecked )}
}))

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

//データを永続化
// export const useModeStore = create<ModeStateType>()(
//   persist(
//     (set) => ({
//       mode: "light",
//       toggleColorMode: () =>
//           set((state) => ({mode: state.mode === "light" ? "dark" : "light"})),
//     }),
//     {
//       name:"mode-storage",
//     },
//   ),
// )
    // console.log("store/indexが呼び出されました");

export default useStore
