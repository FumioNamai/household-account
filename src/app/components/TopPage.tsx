"use client";
import React, { useEffect, useState } from "react";

import { Dayjs } from "dayjs";
import dayjs from "dayjs";

import Monthly from "@/app/components/Monthly";
import Daily from "@/app/components/Daily";
import StockList from "./StockList";
import { Stock } from "../../../utils/type";
import { useSnackbarContext } from "@/providers/context-provider";
import { supabase } from "../../../utils/supabase";
import useStore from "@/store";

export default function TopPage() {
  const { showSnackbar } = useSnackbarContext();
  const [stocks, setStocks] = useState<Stock[]>([]);
  // const { setTax } = useStore()



  const getStocks = async () => {
    try {
      const { data, error } = await supabase.from("stocks").select("*");
      if (error) throw error;
      setStocks(data);
    } catch (error:any) {
      if (showSnackbar) {
        showSnackbar("error", "在庫データを取得できません。" + error.message);
      }
      setStocks([]);
    }
  };

  useEffect(() => {
    (async () => await getStocks())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let [date, setDate] = useState<Dayjs | null>(dayjs());

  // Itemコンポーネントの削除ボタン押下で在庫情報を更新
  // const del = (stocks: Stock[]) => setStocks(stocks);

  // const handleTax = () => {
  //   setTax();
  // };

  return (
    <>
      <main>
        {/* 月別集計 */}
        <Monthly stocks={stocks} setStocks={setStocks} />

        {/* 日別集計 */}
        <Daily
          stocks={stocks}
          setStocks={setStocks}
          date={date}
          setDate={setDate}
        />

        {/* 在庫一覧 */}
        <StockList
          stocks={stocks}
          setStocks={setStocks}
          // handleTax={handleTax}
          date={date}
          setDate={setDate}
          // del={del}
        />
      </main>
    </>
  );
}
