"use client";
import React, { useEffect, useState } from "react";

import { Stock } from "../../../utils/type";
import { useSnackbarContext } from "@/providers/context-provider";
import { supabase } from "../../../utils/supabase";

import { Dayjs } from "dayjs";
import dayjs from "dayjs";

import Monthly from "@/app/components/monthly";
import Daily from "@/app/components/daily";
import StockFilter from "@/app/components/stockFilter";


export default function TopPage() {
  const { showSnackbar } = useSnackbarContext();
  const [stocks, setStocks] = useState<Stock[]>([]);

  const getStocks = async () => {
    try {
      const { data, error } = await supabase.from("stocks").select("*");
      if (error) throw error;
      setStocks(data);
    } catch (error: any) {
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
        {/* <StockList
          stocks={stocks}
          setStocks={setStocks}
          date={date}
          setDate={setDate}
        /> */}

        {/* 在庫検索 */}
        <StockFilter
        stocks={stocks}
        setStocks={setStocks}
        date={date}
        setDate={setDate}
        />
      </main>
    </>
  );
}
