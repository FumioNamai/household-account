"use client";

import React, { useEffect, useState } from "react";
import { getAllStocks } from "../../../utils/supabaseFunctions";
import { Box, FormControl, Typography } from "@mui/material";
import {
  DateCalendar,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Stock } from "../../../utils/interface";

const Monthly = () => {
  const [month, setMonth] = React.useState<Dayjs | null>(dayjs());
  const selectedMonth = month?.format("YYYY-MM");
  const [stocks, setStocks] = useState<Stock[] | null>([]);
  useEffect(() => {
    const getStocks = async () => {
      const stocks = await getAllStocks();
      setStocks(stocks);
    };
    getStocks();
  }, []);

  let date = "0";
  let dailyTotals = [];
  for (let i = 1; i < 32; i++) {
    date = ("00" + `${i}`).slice(-2);
    const todayUsed = stocks!.filter(
      (stock) => stock.use_date === `${selectedMonth}-${date}`
    );

    const todayFoodsTotal = todayUsed
      .filter((todayUsed) => todayUsed.type === "食品")
      .reduce((sum, el) => {
        return sum + el.price;
      }, 0);

    const todayItemsTotal = todayUsed
      .filter((todayUsed) => todayUsed.type === "雑貨")
      .reduce((sum, el) => {
        return sum + el.price;
      }, 0);

      const todayOthersTotal = todayUsed
      .filter((todayUsed) => todayUsed.type === "その他")
      .reduce((sum, el) => {
        return sum + el.price;
      }, 0);

    dailyTotals.push({ date, todayFoodsTotal, todayItemsTotal, todayOthersTotal });
  }

  const monthlyFoodsTotal = dailyTotals.reduce((sum, el) => {
    return sum + el.todayFoodsTotal;
  }, 0);

  const monthlyItemsTotal = dailyTotals.reduce((sum, el) => {
    return sum + el.todayItemsTotal;
  }, 0);

  const monthlyOthersTotal = dailyTotals.reduce((sum, el) => {
    return sum + el.todayOthersTotal;
  }, 0);

  const monthlyTotal = monthlyFoodsTotal + monthlyItemsTotal + monthlyOthersTotal;

  return (
    <>
      <Typography variant="h4" sx={{ marginBottom: "24px" }}>
        月別集計
      </Typography>
      <Box sx={{ paddingInline: "16px" }}>
        <Box>
          <FormControl sx={{ maxWidth: "150px", marginBottom: "24px" }}>
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
          <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom:"16px" }}>
            <Typography variant="h6">合計:</Typography>
            <Typography variant="h6" className=" text-right">
              {monthlyTotal}円
            </Typography>
          </Box>
          <Typography variant="subtitle1">
            内訳
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">食品:</Typography>
            <Typography variant="h6" className=" w-24 text-right">
              {monthlyFoodsTotal}円
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">雑貨:</Typography>
            <Typography variant="h6" className=" w-24 text-right">
              {monthlyItemsTotal}円
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">その他:</Typography>
            <Typography variant="h6" className=" w-24 text-right">
              {monthlyOthersTotal}円
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Monthly;
