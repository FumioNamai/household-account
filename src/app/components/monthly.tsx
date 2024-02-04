"use client";

import React from "react";
import { Box, FormControl, Grid, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import UsedItem from "./UsedItem";

const Monthly = ({ stocks, setStocks }) => {
  const [month, setMonth] = React.useState<Dayjs | null>(dayjs());

  const selectedMonth = month?.format("YYYY-MM");

  let date = "0";
  let dailyTotals = [];
  for (let i = 1; i < 32; i++) {
    date = ("0" + `${i}`).slice(-2);

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

    dailyTotals.push({
      date,
      todayFoodsTotal,
      todayItemsTotal,
      todayOthersTotal,
    });
  }

  //その他の今月使用済みリストを表示させる
  const monthOthers = stocks?.filter(
    (stock) =>
      stock.type === "その他" && stock.use_date?.startsWith(selectedMonth)
  );

  const monthlyFoodsTotal = dailyTotals.reduce((sum, el) => {
    return sum + el.todayFoodsTotal;
  }, 0);

  const monthlyItemsTotal = dailyTotals.reduce((sum, el) => {
    return sum + el.todayItemsTotal;
  }, 0);

  const monthlyOthersTotal = dailyTotals.reduce((sum, el) => {
    return sum + el.todayOthersTotal;
  }, 0);

  const monthlyTotal =
    monthlyFoodsTotal + monthlyItemsTotal + monthlyOthersTotal;

  return (
    <Grid item xs={12} sx={{ marginBottom: "80px" }}>
      <Typography variant="h2" sx={{ fontSize: "24px", marginBottom: "24px" }}>
        月別集計
      </Typography>
      <Box sx={{ paddingInline: "16px" }}>
        <Box>
          <FormControl sx={{ maxWidth: "200px", marginBottom: "24px" }}>
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
          <Box sx={{marginInline:"1rem"}}>
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

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1">その他</Typography>
              <Typography
                variant="body1"
                sx={{ width: "6rem", textAlign: "right" }}
              >
                {monthlyOthersTotal}円
              </Typography>
            </Box>
          </Box>

          <ul>
            {monthOthers?.map((stock) => (
              <Box key={stock.id}>
                <UsedItem
                  id={stock.id}
                  name={stock.name}
                  price={stock.price}
                  stocks={stocks}
                  setStocks={setStocks}
                />
              </Box>
            ))}
          </ul>
        </Box>
      </Box>
    </Grid>
  );
};

export default Monthly;
