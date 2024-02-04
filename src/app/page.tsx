"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import Monthly from "./components/Monthly";
import Daily from "./components/Daily";
import StockList from "./components/StockList";
import StockRegistration from "./components/StockRegistration";

import { Stock } from "../../utils/type";
import { useSnackbarContext } from "@/providers/context-provider";
import ModalStockRegistration from "./components/ModalStockRegistration";

export default function Home() {
  const { showSnackbar } = useSnackbarContext();

  const [stocks, setStocks] = useState<Stock[] | null>([]);
  useEffect(() => {
    (async () => await getStocks())();
  }, []);

  const getStocks = async () => {
    try {
      const { data, error } = await supabase.from("stocks").select("*");
      if (error) throw error;
      setStocks(data);

      // 同じnameで、同じpriceのものはcount数で表示
      const group = (arr: Stock[], func = (v: Stock) => v, detail = false) => {
        const index: string[] = [];
        const result: [
          {
            id: Number;
            type: String;
            name: String;
            length: Number;
          }
        ] = [];

        arr.forEach((v) => {
          const funcResult = func(v);
          const i = index.indexOf(funcResult);
          if (i === -1) {
            index.push(funcResult);
            result.push([v]);
          } else {
            result[i].push(v);
          }
        });
        if (detail) {
          return { index, result };
        }
        return result;
      };

      // console.log(
      //   group(data, (d) => d.name + d.price, { detail: true }).result.map(
      //     (e) => ({
      //       id: e[0].id,
      //       name: e[0].name,
      //       price: e[0].price,
      //       count: e.length,
      //     })
      //   )
      // );
    } catch (error) {
      if (showSnackbar) {
        showSnackbar("error", "在庫データを取得できません。" + error.message);
      }
      setStocks([]);
    }
  };

  let [date, setDate] = React.useState<Dayjs | null>(dayjs());
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
        <Monthly stocks={stocks} setStocks={setStocks} />

        {/* 日別集計 */}
        <Daily
          stocks={stocks}
          setStocks={setStocks}
          date={date}
          setDate={setDate}
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
          // selectedDate={selectedDate}
        />
      </main>
    </>
  );
}
