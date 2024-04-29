"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";

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
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Loading from "./Loading";

export default function TopPage() {
  let [stocks, setStocks] = useState<Stock[]>([]);
  const { showSnackbar } = useSnackbarContext();
  const user = useStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const getStocks = async (userId: string) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) {
      (async () => await getStocks(user.id))();
    }
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
          shop_name: stock.shop_name,
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

  // 指定した時間で処理を遅らせるカスタムフック
  const useDelay = (msec: number) => {
    const [waiting, setWaiting] = useState(true);
    // 指定した時間になったら、待機中(true)から待機終了(false)に変える
    useEffect(() => {
      const timer = setTimeout(() => setWaiting(false), msec);
      // クリーンアップ
      return () => clearTimeout(timer);
    }, [msec]);
    return waiting;
  };

  const ShowMessage = () => {
    // 500ミリ秒遅らせて、stocksが0の時にメッセージを表示
    const waiting = useDelay(500);
    if (stocks.length === 0) {
      return !waiting ? (
        <>
          <Typography textAlign="center" color="error.main" fontWeight="bold">
            登録されている商品がありません！
          </Typography>
          <Typography textAlign="center" color="warning.dark" variant="body2">
            在庫一覧/検索ページから商品登録をするか
          </Typography>
          <Typography textAlign="center" color="warning.dark" variant="body2">
            買い物リストページから登録しましょう！
          </Typography>
        </>
      ) : null;
    } else {
      return;
    }
  };

  const [page, setPage] = useState<string | null>("Monthly");
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newPage: string | null
  ) => {
    if (newPage !== null) setPage(newPage);
  };
  // ToggleButtonで画面を出しわける
  const SwitchPages = () => {
    switch (page) {
      // 月別集計
      case "Monthly":
        return <Monthly stocks={stocks} setStocks={setStocks} />;
      // 日別集計
      case "Daily":
        return (
          <Daily
            stocks={stocks}
            setStocks={setStocks}
            date={date}
            setDate={setDate}
          />
        );
      // 在庫検索
      case "StockFilter":
        return (
          <StockFilter
            groupedDataArr={groupedDataArr}
            setStocks={setStocks}
            date={date}
            setDate={setDate}
          />
        );
      // 買い物リスト
      case "ToBuyList":
        return (
          <ToBuyList
            groupedDataArr={groupedDataArr}
            setStocks={setStocks}
            selectedDate={selectedDate}
          />
        );
    }
  };
  return (
    <>
      {
        <main>
          {ShowMessage()}
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Stack
                direction="row"
                justifyContent="center"
                sx={{ marginBottom: 4 }}
              >
                <ToggleButtonGroup
                  exclusive
                  color="primary"
                  value={page}
                  onChange={handleChange}
                  size="small"
                >
                  <ToggleButton value="Monthly">月別集計</ToggleButton>
                  <ToggleButton value="Daily">日別集計</ToggleButton>
                  <ToggleButton value="StockFilter">在庫一覧/検索</ToggleButton>
                  <ToggleButton value="ToBuyList">買い物リスト</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              {SwitchPages()}
            </>
          )}
        </main>
      }
    </>
  );
}
