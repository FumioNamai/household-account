"use client";
import React, { useEffect, useState } from "react";

import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import Monthly from "../components/Monthly";
import Daily from "../components/Daily";
import StockList from "../components/StockList";
import { Stock } from "../../../utils/type";
import { useSnackbarContext } from "@/providers/context-provider";
import { supabase } from "../../../utils/supabase";
import useStore from "@/store";

export default function TopPage() {
  const { showSnackbar } = useSnackbarContext();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const { setTax } = useStore()

  useEffect(() => {
    (async () => await getStocks())();
  }, []);

  const getStocks = async () => {
    try {
      const { data, error } = await supabase.from("stocks").select("*");
      if (error) throw error;
      setStocks(data);

    } catch (error) {
      if (showSnackbar) {
        showSnackbar("error", "在庫データを取得できません。" + error.message);
      }
      setStocks([]);
    }
  };

  let [date, setDate] = useState<Dayjs | null>(dayjs());
  let [price, setPrice] = useState<string>("");
  // const [tax, setTax] = useState(true);

  // Itemコンポーネントの削除ボタン押下で在庫情報を更新
  const del = (stocks: Stock[]) => setStocks(stocks);

  const handleTax = () => {
    setTax();
  };

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
          // tax={tax}
          // setTax={setTax}
          handleTax={handleTax}
          price={price}
          setPrice={setPrice}
          date={date}
          setDate={setDate}
          del={del}
        />
      </main>
    </>
  );
}
