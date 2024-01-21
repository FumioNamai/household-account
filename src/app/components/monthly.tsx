"use client";

import React, { useEffect, useState } from "react";
import { getAllStocks } from "../../../utils/supabaseFunctions";
import { FormControl, Typography } from "@mui/material";
import { DateCalendar, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
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

    const todaysFoodsTotal = todayUsed
      .filter((todayUsed) => todayUsed.type === "食品")
      .reduce((sum, el) => {
        return sum + el.price;
      }, 0);

    const todaysItemsTotal = todayUsed
      .filter((todayUsed) => todayUsed.type === "雑貨")
      .reduce((sum, el) => {
        return sum + el.price;
      }, 0);

    dailyTotals.push({ date, todaysFoodsTotal, todaysItemsTotal });
  }

  const monthlyFoodsTotal = dailyTotals.reduce((sum, el) => {
    return sum + el.todaysFoodsTotal;
  }, 0);

  const monthlyItemsTotal = dailyTotals.reduce((sum, el) => {
    return sum + el.todaysItemsTotal;
  }, 0);

  const monthlyTotal = monthlyFoodsTotal + monthlyItemsTotal;

  return (
    <>
      <Typography variant="h4">月間合計</Typography>
      <div className="mb-10">
        <FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            defaultValue={dayjs()}
            label={'対象年月'}
            views={['year', 'month']}
            format="YYYY年MM月"
            onChange={(month) => setMonth(month)}
          />
          </LocalizationProvider>
        </FormControl>
        <div className="flex">
          <Typography variant="subtitle1">合計:</Typography>
          <Typography variant="body1" className=" w-20 text-right">{monthlyTotal}円</Typography>
        </div>
        <div className="flex">
          <p className="w-12 mr-4 text-end">内訳</p>
          <div className="flex mr-4">
            <p>食品:</p>
            <p className=" w-16 text-right">{monthlyFoodsTotal}円</p>
          </div>
          <div className="flex">
            <p>雑貨:</p>
            <p className=" w-16 text-right">{monthlyItemsTotal}円</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Monthly;
