import { useTaxStore } from "@/store";

  // 税抜き⇔税込みで表示金額を切り替える処理
  export const CalcPrice = (price:number, type:string) => {
    const tax = useTaxStore((state) => state.tax);

    if(tax) return price

    const taxRate = type === "食品" ? 1.08 : 1.1
    return Math.ceil(price/taxRate)
  };
