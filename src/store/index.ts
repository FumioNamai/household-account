import { Database } from "@/lib/database.types";

// Zustand Reactの状態管理ライブラリ
import { create } from "zustand";

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

type ModeStateType = {
  mode : boolean
  setMode : () => void
}

export const useModeStore = create<ModeStateType>((set) => ({
  mode: true,
  setMode: () => set( state => ({mode : !state.mode}))
}))

export default useStore
