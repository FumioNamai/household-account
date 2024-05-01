// Zustand Reactの状態管理ライブラリ
import { create } from "zustand";

import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import { Database } from "@/lib/database.types";
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
}))

export default useStore

type DateStateType = {
  date : Dayjs | null
  setDate : (newDate: Dayjs | null ) => void
  selectedDate : () => string | undefined
}
export const useDateStore = create<DateStateType>((set) => ({
  date: dayjs(),
  setDate : (newDate) => set({date:newDate}),
  selectedDate: () => {
    const state:DateStateType = useDateStore.getState()
    return state.date?.locale(ja).format("YYYY-MM-DD")
  }
}))
