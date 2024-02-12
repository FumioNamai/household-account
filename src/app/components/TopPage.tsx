"use client";
import React, { useEffect, useState } from "react";

import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import Monthly from "../components/Monthly";
import Daily from "../components/Daily";
import StockList from "../components/StockList";
import StockRegistration from "../components/StockRegistration";

import { Stock } from "../../../utils/type";
import { useSnackbarContext } from "@/providers/context-provider";
import ModalStockRegistration from "../components/ModalStockRegistration";
import { cookies } from 'next/headers'
import { supabase } from "../../../utils/supabase";

type Props = {
  session: {
    user: {
      id: string;
    }
  }
}

export default function TopPage({session}:Props) {
  const { showSnackbar } = useSnackbarContext();

  const [stocks, setStocks] = useState<Stock[]>([]);

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
  const [tax, setTax] = useState(true);

  // Itemコンポーネントの削除ボタン押下で在庫情報を更新
  const del = (stocks: Stock[]) => setStocks(stocks);

  const handleTax = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTax(event.target.checked);
  };

  return (
    <>
      <main>
        {/* 月別集計 */}
        <Monthly stocks={stocks} setStocks={setStocks} session={session}/>

        {/* 日別集計 */}
        <Daily
          stocks={stocks}
          setStocks={setStocks}
          date={date}
          setDate={setDate}
          session={session}
        />

        {/* <StockRegistration
          stocks={stocks}
          setStocks={setStocks}
          tax={tax}
          setTax={setTax}
          price={price}
          setPrice={setPrice}
          date={date}
          setDate={setDate}
        /> */}

        {/* <ModalStockRegistration
          stocks={stocks}
          setStocks={setStocks}
          tax={tax}
          setTax={setTax}
          price={price}
          setPrice={setPrice}
          date={date}
          setDate={setDate}
        /> */}
        <StockList
          stocks={stocks}
          setStocks={setStocks}
          tax={tax}
          setTax={setTax}
          handleTax={handleTax}
          price={price}
          setPrice={setPrice}
          date={date}
          setDate={setDate}
          del={del}
          session={session}
          // selectedDate={selectedDate}
        />
      </main>
    </>
  );
}
