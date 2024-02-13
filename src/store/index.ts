import { Database } from "@/lib/database.types";

// Zustand Reactの状態管理ライブラリ
import { create } from "zustand";

// プロフィール情報を状態管理に格納する⇒どこでもプロフィール情報を取得できるようになる
type ProfileType = Database['public']['Tables']['profiles']['Row']

type StateType = {
  user : ProfileType
  setUser : (payload: ProfileType) => void
  tax : boolean
  setTax: () => void
}

const useStore = create<StateType>((set) => ({
  // 初期値
  user: { id:'', email:'', name:'', introduce:'', avatar_url:''},
  setUser:(payload) => set({user:payload}),
  tax: true,
  setTax: () => set(state => ({ tax : !state.tax }))
}))

export default useStore
