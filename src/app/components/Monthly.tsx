"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import UsedItem from "@/app/components/UsedItem";
import { Stock } from "../../../utils/type";
import useStore, { useTaxStore } from "@/store";
import TaxSwitch from "@/app/components/TaxSwitch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Props = {
  stocks: Stock[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const Monthly = ({ stocks, setStocks }: Props) => {
  const [month, setMonth] = useState<Dayjs | null>(dayjs());
  const user = useStore((state) => state.user);
  const tax = useTaxStore((state) => state.tax);

  const selectedMonth: string | null = month!.format("YYYY-MM");

  // 指定した月の1日ごとの種別使用金額を取得
  let date = "0";

  type DailyTotal = {
    date: string;
    todayFoodsTotal: number;
    todayItemsTotal: number;
    todayOthersTotal: number;
  };
  let dailyTotals: DailyTotal[] = [];
  for (let i = 1; i < 32; i++) {
    date = ("0" + `${i}`).slice(-2);
    const todayUsed: Stock[] = stocks!.filter(
      (stock) =>
        stock.user_id === user.id &&
        stock.use_date === `${selectedMonth}-${date}`
    );

    const calcTodayTypeTotal = (type: string) => {
      const result = todayUsed
        .filter((todayUsed: Stock) => todayUsed.type === type)
        .reduce((sum: number, el: Stock) => {
          return sum + el.price;
        }, 0);
      return result;
    };

    const todayFoodsTotal = calcTodayTypeTotal("食品");
    const todayItemsTotal = calcTodayTypeTotal("雑貨");
    const todayOthersTotal = calcTodayTypeTotal("その他");

    dailyTotals.push({
      date,
      todayFoodsTotal,
      todayItemsTotal,
      todayOthersTotal,
    });
  }

  //指定した月の消費品目を取得する
  const monthOthers: Stock[] = stocks?.filter(
    (stock) =>
      stock.user_id === user.id &&
      stock.type === "その他" &&
      stock.use_date?.startsWith(selectedMonth)
  );
  // 指定した月に使用した合計金額を算出する関数
  const calcMonthlyTypeTotal = (type: keyof DailyTotal): number => {
    let monthlyTypeTotal: number = dailyTotals.reduce((sum, el) => {
      return sum + (el[type] as number);
    }, 0);
    return monthlyTypeTotal;
  }
  // 指定した月に使用した食品の合計金額を算出
  let monthlyFoodsTotal = calcMonthlyTypeTotal("todayFoodsTotal");
  // 税込・税抜金額の切り替え
  monthlyFoodsTotal = tax
    ? monthlyFoodsTotal
    : Math.ceil(monthlyFoodsTotal / 1.08);

  // 指定した月に使用した雑貨の合計金額を算出
  let monthlyItemsTotal = calcMonthlyTypeTotal("todayItemsTotal");
  // 税込・税抜金額の切り替え
  monthlyItemsTotal = tax
    ? monthlyItemsTotal
    : Math.ceil(monthlyItemsTotal / 1.1);

  // 指定した月に使用したその他の合計金額を算出
  let monthlyOthersTotal = calcMonthlyTypeTotal("todayOthersTotal");
  // 税込・税抜金額の切り替え
  monthlyOthersTotal = tax
    ? monthlyOthersTotal
    : Math.ceil(monthlyOthersTotal / 1.1);

  // 指定した月の合計使用金額を算出
  const monthlyTotal: number =
    monthlyFoodsTotal + monthlyItemsTotal + monthlyOthersTotal;

  return (
    <Box sx={{ marginBottom: "80px" }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={4}
        sx={{
          marginBottom: "16px",
        }}
      >
        <Typography variant="h2" sx={{ fontSize: "24px" }}>
          月別集計
        </Typography>
        <FormControl sx={{ maxWidth: "200px" }}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            dateFormats={{ monthAndYear: "YYYY年 MM月" }}
          >
            <DatePicker
              defaultValue={dayjs()}
              label={"対象年月"}
              views={["month", "year"]}
              format="YYYY年MM月"
              onChange={(month) => setMonth(month)}
            />
          </LocalizationProvider>
        </FormControl>
      </Stack>

      {/* 税表示切替 */}
      <Stack direction="row" justifyContent="end" sx={{ marginRight: "8px" }}>
        <TaxSwitch />
      </Stack>

      <Box sx={{ paddingInline: "16px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Typography variant="h6">合計</Typography>
          <Typography variant="h6" sx={{ textAlign: "right" }}>
            {monthlyTotal}円
          </Typography>
        </Box>

        <Typography variant="subtitle1">内訳</Typography>
        <Box sx={{ paddingLeft: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">食品</Typography>
            <Typography
              variant="body1"
              sx={{ width: "6rem", textAlign: "right" }}
            >
              {monthlyFoodsTotal}円
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">雑貨</Typography>
            <Typography
              variant="body1"
              sx={{ width: "6rem", textAlign: "right" }}
            >
              {monthlyItemsTotal}円
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              marginBottom: "24px",
            }}
          >
            <Typography variant="body1">その他</Typography>
            <Typography
              variant="body1"
              sx={{ width: "6rem", textAlign: "right" }}
            >
              {monthlyOthersTotal}円
            </Typography>
          </Stack>
        </Box>
      </Box>
      <Accordion square={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ fontWeight: "400" }}
        >
          消費品目（その他）
        </AccordionSummary>
        <AccordionDetails>
          <ul>
            {monthOthers?.map((stock) => (
              <Box key={stock.id}>
                <UsedItem
                  id={stock.id}
                  name={stock.name}
                  price={tax ? stock.price : Math.ceil(stock.price / 1.1)}
                  setStocks={setStocks}
                />
              </Box>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Monthly;
