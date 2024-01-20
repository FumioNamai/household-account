"use client";

import Link from "next/link";
// import Stock from "./components/stock";
import Daily from "./components/daily";
import React, { useEffect, useState } from "react";
import { getAllStocks } from "../../utils/supabaseFunctions";
import UsedItem from "./components/usedItem";
import { supabase } from "../../utils/supabase";
import Item from "./components/item";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import { Stock } from "../../utils/interface";

// const today: string = new Date().toLocaleDateString("sv-SE");
// const today = dayjs().format('YYYY-MM-DD')
const categories: string[] = [
  "肉",
  "魚介",
  "野菜",
  "乾物",
  "フルーツ",
  "調味料",
  "お菓子",
  "その他",
];

export default function Home() {
  const [stocks, setStocks] = useState<Stock[] | null>([])

  let [date, setDate] = React.useState<Dayjs | null>(dayjs());

  const [type, setType] = useState<string>("");
  const [name, setName] = useState<string>("");
  let [price, setPrice] = useState<string>("");
  const [tax, setTax] = useState(true);
  const [categoryItem, setCategoryItem] = useState("");

  useEffect(() => {
    (async () => await getStocks())();
  }, []);

  // 全ての在庫情報を取得
  const getStocks = async () => {
    try {
      const { data, error } = await supabase.from("stocks").select("*");
      if (error) throw error;
      setStocks(data);
    } catch (error) {
      alert(error.message);
      setStocks([]);
    }
  };

  // Itemコンポーネントの使用ボタン押下でuse_dateを更新
  // const update = (updatedStock: Stock) =>  {
  //   setStock(prevStocks => {
  //     const newStocks = prevStocks.map(stock => {
  //       return stock.id === updatedStock.id ? updatedStock :stock;
  //     })
  //     return newStocks
  //   });
  // }
  const update = (stocks: Stock[]) => setStocks(stocks);
  // console.log(props);

  // Itemコンポーネントの削除ボタン押下で在庫情報を更新
  const del = (stocks: Stock[]) => setStocks(stocks);

  const selectedDate = date?.locale(ja).format("YYYY-MM-DD");

  const todayUsed: Stock[] = stocks!.filter(
    (stock: Stock) => stock.use_date === `${selectedDate}`
  );

  // その日に使用した食品の合計金額を算出
  const todayFoods = todayUsed.filter(
    (todayUsed: Stock) => todayUsed.type === "食品"
  );
  const todaysFoodsTotal = todayFoods.reduce((sum: number, el) => {
    return sum + el.price;
  }, 0);

  // その日に使用した雑貨の合計金額を算出
  const todayItems = todayUsed.filter(
    (todayUsed: Stock) => todayUsed.type === "雑貨"
  );
  const todaysItemsTotal = todayItems.reduce((sum: number, el) => {
    return sum + el.price;
  }, 0);
  // その月に使用したその他の合計金額を算出

  // その日の合計金額を算出
  const total = todaysFoodsTotal + todaysItemsTotal;

  // 在庫登録
  const handleForm = async (e: any) => {
    e.preventDefault();
    if (type === "食品" && tax === false) {
      price = Math.round(parseInt(price) * 1.08).toString();
    }
    if (type !== "食品" && tax === true) {
      price = Math.round(parseInt(price) * 1.1).toString();
      price = (parseInt(price) * 1.1).toString();
    }

    try {
      const { error } = await supabase.from("stocks").insert({
        type: type,
        name: name,
        price: price,
        registration_date: date,
        category: categoryItem,
      });
      if (error) throw error;

      setType("");
      setName("");
      setPrice("");
      setCategoryItem("");
      await getStocks();

      alert(`${name}を在庫一覧に登録しました。`)

    } catch (error) {
      alert("データの新規登録ができません");
    }
  };

  const handleTax = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTax(event.target.checked);
  };

  const handleSelectItem = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryItem(event.target.value);
  };

  return (
    <>
      <main>
        <div className="">
          <Typography variant="h4" className="mb-4">
            日別集計
          </Typography>
          {/* <Daily stocks={stocks}/> */}
          <div className="flex flex-col mb-20">
            <div className="mb-10">
              <FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={date}
                    // defaultValue={dayjs()}
                    format="YYYY/MM/DD"
                    onChange={(date) => setDate(date)}
                  />
                </LocalizationProvider>
                {/* <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                /> */}
              </FormControl>
              <div>
                <Typography variant="h6">
                  食品 小計:{todaysFoodsTotal}円
                </Typography>
                <Typography variant="h6">
                  雑貨 小計:{todaysItemsTotal}円
                </Typography>
                <Typography variant="h6">合計: {total}円</Typography>
              </div>
            </div>

            <div className="">
              <Typography variant="h6">消費品目</Typography>
              <div className="mb-8">
                <h2 className="mb-2">食品</h2>
                <ul>
                  {todayFoods.map((todayFood: Stock) => (
                    <div key={todayFood.id}>
                      {todayFood.type === "食品" &&
                      todayFood.use_date === `${selectedDate}` ? (
                        <UsedItem props={todayFood} onUpdate={update} />
                        // <UsedItem props={todayFood} />

                      ) : null}
                    </div>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mb-2 ">雑貨</h2>
                <ul>
                  {todayItems.map((todayItem: Stock) => (
                    <div key={todayItem.id}>
                      {todayItem.type === "雑貨" &&
                      todayItem.use_date === `${selectedDate}` ? (
                        <UsedItem props={todayItem} onUpdate={update} />
                      ) : null}
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <Typography variant="h4" className="mb-4">
              在庫登録
            </Typography>
            <div className="mb-10">
              <form className="" onSubmit={handleForm}>
                <InputLabel>購入日</InputLabel>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={date}
                    format="YYYY/MM/DD"
                    onChange={(date) => setDate(date)}
                  />
                </LocalizationProvider>

                <InputLabel>種別</InputLabel>
                <div className="flex flex-row items-center gap-1">
                  <ToggleButtonGroup
                    // size="small"
                    color="primary"
                    value={type}
                    exclusive
                    onChange={(event, newType) => setType(newType)}
                  >
                    <ToggleButton value="食品">食品</ToggleButton>
                    <ToggleButton value="雑貨">雑貨</ToggleButton>
                    <ToggleButton value="その他">その他</ToggleButton>
                  </ToggleButtonGroup>
                </div>
                {/* <p>分類</p> */}
                <FormControl sx={{ my: 2, mr: 2, minWidth: 120 }}>
                  <InputLabel>分類</InputLabel>
                  <Select
                    id="category"
                    value={categoryItem}
                    label="分類"
                    onChange={handleSelectItem}
                    sx={{}}
                  >
                    <MenuItem value={"肉"}>肉</MenuItem>
                    <MenuItem value={"魚介"}>魚介</MenuItem>
                    <MenuItem value={"野菜"}>野菜</MenuItem>
                    <MenuItem value={"乾物"}>乾物</MenuItem>
                    <MenuItem value={"フルーツ"}>フルーツ</MenuItem>
                    <MenuItem value={"調味料"}>調味料</MenuItem>
                    <MenuItem value={"お菓子"}>お菓子</MenuItem>
                    <MenuItem value={"その他"}>その他</MenuItem>
                  </Select>
                </FormControl>

                {/* 在庫登録 兼 在庫検索機能 */}

                <FormControl sx={{ my: 2 }}>
                  <TextField
                    label="商品名"
                    variant="outlined"
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <div className="flex flex-row items-center gap-1">
                  <Typography>税抜き</Typography>
                  <FormControlLabel
                    control={
                      <Switch checked={tax} onChange={handleTax} />
                    }
                    label="税込み"
                  />


                  <TextField
                    label="価格"
                    id="outlined-start-adornment"
                    sx={{ m: 1, width: "15ch" }}
                    value={price}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">円</InputAdornment>
                      ),
                    }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setPrice(event.target.value);
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <div>
                    <Button
                      variant="outlined"
                      type="submit"
                    >
                      登録
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            <Typography variant="h4" className="mb-4">
              在庫一覧
            </Typography>
            <Box sx={{display:"flex", alignItems:"center"}}>
            <Typography>税抜き</Typography>
            <FormControlLabel
              control={<Switch checked={tax} onChange={handleTax} />}
              label="税込み"
            />
            </Box>
            <div className="mb-10 border p-1">
              <h2 className="mb-2">食品</h2>

              {categories.map((category) => (
                <div key={category} className="border rounded-md mb-2 p-1">
                  <h3 className="">{category}</h3>
                  <div>
                    <ul>
                      {stocks!
                        .sort((a, b) => b.id - a.id)
                        .map((stock: Stock) => (
                          <div key={stock.id}>
                            {stock.type === "食品" &&
                            stock.category === category &&
                            stock.use_date === null ? (
                              <Item
                                props={stock}
                                onDelete={del}
                                onUpdate={update}
                                date={selectedDate}
                                tax={tax}
                              />
                            ) : null}
                          </div>
                        ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-10 border p-1">
              <h2 className="mb-2">雑貨</h2>
              <div>
                <ul>
                  {stocks!
                    .sort((a, b) => b.id - a.id)
                    .map((stock: Stock) => (
                      <div key={stock.id}>
                        {stock.type === "雑貨" && stock.use_date === null ? (
                          <Item
                            props={stock}
                            onDelete={del}
                            onUpdate={update}
                            date={selectedDate}
                            tax={tax}
                          />
                        ) : null}
                      </div>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
