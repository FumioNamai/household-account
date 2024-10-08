// Zustand Reactの状態管理ライブラリ
import { create } from "zustand";

import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import { Database } from "@/lib/database.types";
import { Stock } from "../../utils/type";
import { supabase } from "../../utils/supabase";

// プロフィール情報を状態管理に格納する⇒どこでもプロフィール情報を取得できるようになる
type ProfileType = Database['public']['Tables']['profiles']['Row']

interface StateType {
  user : ProfileType
  setUser : (payload: ProfileType) => void
}
export const useStore = create<StateType>((set) => ({
  // 初期値
  user: { id:'', email:'', name:'', introduce:'', avatar_url:''},
  setUser:(payload) => set({user:payload}),
}))
export default useStore

// 税込・税抜き計算
interface TaxState {
  tax : boolean
  setTax: () => void
}
export const useTaxStore = create<TaxState>((set) => ({
  tax: true,
  setTax: () => set(state => ({ tax : !state.tax })),
}))

// 買い物リスト編集・並べ替えモード切り替え
interface SortableState {
  isSortable : boolean
  setIsSortable: () => void
}
export const useSortableStore = create<SortableState>((set) => ({
  isSortable: false,
  setIsSortable: () => set(state => ({ isSortable : !state.isSortable })),
}))

// 買い物リスト内で購入予定店の変更したときに店選択Chipの表示に反映させる
interface ReloadState {
  reload : number
  setReload: () => void
}
export const useReloadStore = create<ReloadState>((set) => ({
  reload: 0,
  setReload: () => set(state => ({ reload : state.reload + 1 })),
}))

// 登録日・使用日の変更
interface DateState {
  date : Dayjs | null
  setDate : (newDate: Dayjs | null ) => void
  selectedDate : () => string | undefined
}
export const useDateStore = create<DateState>((set) => ({
  date: dayjs(),
  setDate : (newDate) => set({date:newDate}),
  selectedDate: () => {
    const state:DateState = useDateStore.getState()
    return state.date?.locale(ja).format("YYYY-MM-DD")
  }
}))

// データベースから在庫データを取り出す
interface StockState {
  stocks: Stock[]
  setStocks: (stocks:Stock[]) => void
  error: string | null
  isLoading: boolean
  setIsLoading: (isLoading:boolean) => void
  getStocks: (userId:string) => Promise<void>
}
export const useStockStore = create<StockState>((set,get) => ({
  stocks:[],
  setStocks: (stocks) => set({stocks}),
  error: null,
  isLoading: false,
  setIsLoading : (isLoading) => set({isLoading}),

  getStocks: async (userId: string) => {
    set({isLoading:true, error:null})
    try {
      let allData:any[] = [];
      const pageSize = 1000; //1回に取得するレコード数（1000が既定の上限なので1000以下で設定）
      let start = 0;
      let end = pageSize -1;

      while(true){
        const { data, error } = await supabase
          .from("stocks")
          .select("*")
          .eq("user_id", userId)
          .range(start, end); //ページネーションの範囲を指定

        if (error) throw error;

        if (data.length === 0) {
          break; // データが無ければループを終了
        }

        allData = [...allData, ...data]; // データを全体リストに追加

        // 次のページに異動
        start += pageSize;
        end += pageSize;
      }
      get().setStocks(allData); // 全てのデータを設定
    } catch (error: any) {
      set({error: error.message})
      get().setStocks([]); // エラー時には空配列をセット
    } finally {
      get().setIsLoading(false);
    }
  },
}))
