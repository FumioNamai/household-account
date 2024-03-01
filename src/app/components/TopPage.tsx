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
import useStore from "@/store";


export default function TopPage() {
  const { showSnackbar } = useSnackbarContext();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const { user } = useStore()

  const getStocks = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("stocks").select("*")
      .eq("user_id", userId);
      if (error) throw error;
      setStocks(data);
      console.log(data);
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar("error", "在庫データを取得できません。" + error.message);
      }
      setStocks([]);
    }
  };
  // getStocks(user.id)


  useEffect(() => {
    (async () => await getStocks(user.id))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  const groupedData: { [key: string]: any }  = {}
  console.log(stocks);

  stocks.forEach(stock => {
    if(!stock.use_date) {
      const key = `${stock.name}-${stock.price}`;
      if (!groupedData[key]) {
        groupedData[key] =
        {
            id: stock.id,
            name:stock.name,
            price: stock.price,
            count:0,
            type: stock.type,
            registration_date:stock.registration_date,
            use_date:stock.use_date,
            category: stock.category,
          }
        }
        groupedData[key].count++
    }
    })
    const groupedDataArr = Object.values(groupedData)

    console.log(groupedDataArr);
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
        groupedDataArr={groupedDataArr}
        stocks={stocks}
        setStocks={setStocks}
        date={date}
        setDate={setDate}
        />
      </main>
    </>
  );
}
