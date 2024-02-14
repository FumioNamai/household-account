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
  // handleTax: ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void) | undefined
}

export const useStore = create<StateType>((set) => ({
  // 初期値
  user: { id:'', email:'', name:'', introduce:'', avatar_url:''},
  setUser:(payload) => set({user:payload}),
  tax: true,
  setTax: () => set(state => ({ tax : !state.tax })),
  // handleTax: (event) => {
  //   const isChecked = event.target.checked
  //   set( isChecked )}
}))

// type PriceState = {
//   price : string;
//   setPrice : (price:string) => void
//   handlePriceChange: (event: React.ChangeEvent<HTMLInputElement>) =>
//     void
// }


// export const usePriceStore = create<PriceState>((set) => ({
//   price:"",
//   setPrice:(newPrice) => set({ price: newPrice}),
//   handlePriceChange : (event) => {
//     const newPrice = event.target.value;
//     set({price:newPrice})
//   }
// }))

export default useStore
