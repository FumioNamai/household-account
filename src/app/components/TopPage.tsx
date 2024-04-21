"use client";
import React, { useEffect, useState } from "react";

import { Stock } from "../../../utils/type";
import { useSnackbarContext } from "@/providers/context-provider";
import { supabase } from "../../../utils/supabase";

import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import Monthly from "@/app/components/Monthly";
import Daily from "@/app/components/Daily";
import StockFilter from "@/app/components/StockFilter";
import useStore from "@/store/index";
import ToBuyList from "@/app/components/ToBuyList";

export default function TopPage() {
  let [stocks, setStocks] = useState<Stock[]>([]);
  const { showSnackbar } = useSnackbarContext();
  const user = useStore((state) => state.user);

  const getStocks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      setStocks(data);
      return;
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar("error", "在庫データを取得できません。" + error.message);
      }
      setStocks([]);
    }
  };

  useEffect(() => {
    (async () => await getStocks(user.id))();
  }, [user.id]);

  stocks = stocks.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    if (a.reference_price! < b.reference_price!) return -1;
    if (a.reference_price! > b.reference_price!) return 1;
    return a.id - b.id;
  });

  //nameとprice,reference_priceが同じものをグループにまとめて、countに個数を登録したい
  const groupedData: { [key: string]: any } = {};
  stocks.forEach((stock) => {
    if (!stock.use_date) {
      const key = `${stock.name}-${stock.price}-${stock.reference_price}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          id: stock.id,
          name: stock.name,
          price: stock.price,
          reference_price: stock.reference_price,
          count: 0,
          type: stock.type,
          registration_date: stock.registration_date,
          use_date: stock.use_date,
          category: stock.category,
          to_buy: stock.to_buy,
          checked: stock.checked,
        };
      }
      groupedData[key].count++;
    }
  });
  const groupedDataArr = Object.values(groupedData);

  let [date, setDate] = useState<Dayjs | null>(dayjs());
  const selectedDate: string | undefined = date
    ?.locale(ja)
    .format("YYYY-MM-DD");

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

        {/* 在庫検索 */}
        <StockFilter
          groupedDataArr={groupedDataArr}
          setStocks={setStocks}
          date={date}
          setDate={setDate}
        />

        {/* 買い物リスト */}
        <ToBuyList
          groupedDataArr={groupedDataArr}
          setStocks={setStocks}
          selectedDate={selectedDate}
        />
      </main>
    </>
  );
}
