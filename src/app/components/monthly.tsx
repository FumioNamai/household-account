"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  Grid,
  Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import UsedItem from "@/app/components/usedItem";
import { Stock } from "../../../utils/type";
import useStore, { useTaxStore } from "@/store";
import TaxSwitch from "./taxSwitch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const Monthly: React.FC<{
  stocks: Stock[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
}> = ({ stocks, setStocks }) => {
  const [month, setMonth] = useState<Dayjs | null>(dayjs());
  const user = useStore((state) => (state.user));
  const tax = useTaxStore((state) => (state.tax));

  const selectedMonth: string | null = month!.format("YYYY-MM");

  let date = "0";
  let dailyTotals = [];

  for (let i = 1; i < 32; i++) {
    date = ("0" + `${i}`).slice(-2);

    const todayUsed: Stock[] = stocks!.filter(
      (stock) =>
        stock.user_id === user.id &&
        stock.use_date === `${selectedMonth}-${date}`
    );

    const todayFoodsTotal: number = todayUsed
      .filter((todayUsed: Stock) => todayUsed.type === "食品")
      .reduce((sum: number, el: Stock) => {
        return sum + el.price;
      }, 0);

    const todayItemsTotal: number = todayUsed
      .filter((todayUsed: Stock) => todayUsed.type === "雑貨")
      .reduce((sum, el) => {
        return sum + el.price;
      }, 0);

    const todayOthersTotal: number = todayUsed
      .filter((todayUsed: Stock) => todayUsed.type === "その他")
      .reduce((sum, el) => {
        return sum + el.price;
      }, 0);

    dailyTotals.push({
      date,
      todayFoodsTotal,
      todayItemsTotal,
      todayOthersTotal,
    });
  }

  //その他の今月使用済みリストを表示させる
  const monthOthers: Stock[] = stocks?.filter(
    (stock) =>
      stock.user_id === user.id &&
      stock.type === "その他" &&
      stock.use_date?.startsWith(selectedMonth)
  );

  let monthlyFoodsTotal: number = dailyTotals.reduce((sum, el) => {
    return sum + el.todayFoodsTotal;
  }, 0);
  monthlyFoodsTotal = tax
    ? monthlyFoodsTotal
    : Math.ceil(monthlyFoodsTotal / 1.08);

  let monthlyItemsTotal: number = dailyTotals.reduce((sum, el) => {
    return sum + el.todayItemsTotal;
  }, 0);
  monthlyItemsTotal = tax
    ? monthlyItemsTotal
    : Math.ceil(monthlyItemsTotal / 1.1);

  let monthlyOthersTotal: number = dailyTotals.reduce((sum, el) => {
    return sum + el.todayOthersTotal;
  }, 0);
  monthlyOthersTotal = tax
    ? monthlyOthersTotal
    : Math.ceil(monthlyOthersTotal / 1.1);

  const monthlyTotal: number =
    monthlyFoodsTotal + monthlyItemsTotal + monthlyOthersTotal;

  return (
    <Grid item xs={12} sx={{ marginBottom: "80px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "16px",
        }}
      >
        <Typography variant="h2" sx={{ fontSize: "24px" }}>
          月別集計
        </Typography>
        <FormControl sx={{ maxWidth: "200px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              defaultValue={dayjs()}
              label={"対象年月"}
              views={["year", "month"]}
              format="YYYY年MM月"
              onChange={(month) => setMonth(month)}
            />
          </LocalizationProvider>
        </FormControl>
      </Box>

      {/* 税表示切替 */}
      <Box sx={{ display: "flex", justifyContent: "end", marginRight: "8px" }}>
        <TaxSwitch />
      </Box>

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
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1">食品</Typography>
            <Typography
              variant="body1"
              sx={{ width: "6rem", textAlign: "right" }}
            >
              {monthlyFoodsTotal}円
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1">雑貨</Typography>
            <Typography
              variant="body1"
              sx={{ width: "6rem", textAlign: "right" }}
            >
              {monthlyItemsTotal}円
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
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
          </Box>
        </Box>
        </Box>
        <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontWeight:"400" }}>
          消費品目（その他）
        </AccordionSummary>
        <AccordionDetails>
          <ul>
            {monthOthers?.map((stock) => (
              <Box key={stock.id}>
                <UsedItem
                  id={stock.id}
                  name={stock.name}
                  stocks={stocks}
                  setStocks={setStocks}
                  price={tax ? stock.price : Math.ceil(stock.price / 1.1)}
                />
              </Box>
            ))}
          </ul>
          </AccordionDetails>
      </Accordion>

    </Grid>
  );
};

export default Monthly;
