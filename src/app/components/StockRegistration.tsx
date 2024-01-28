import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Categories } from "./Categories";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSnackbarContext } from "@/providers/context-provider";
import React, { useState } from "react";
import { supabase } from "../../../utils/supabase";
import dayjs, { Dayjs } from "dayjs";
import { Stock } from "../../../utils/interface";


const StockRegistration  = ({tax, setTax, price, setPrice, date, setDate, stocks, setStocks}) => {
  const { showSnackbar } = useSnackbarContext()
  const [type, setType] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [categoryItem, setCategoryItem] = useState("---");

  const onUpdate = (stocks: Stock[]) => setStocks(stocks);

  const handleForm = async (e: any) => {
    e.preventDefault();
    if (type === "食品" && tax === false) {
      price = Math.floor(parseInt(price) * 1.08).toString();
    }
    if (type !== "食品" && tax === false) {
      price = Math.floor(parseInt(price) * 1.1).toString();
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
      // await getStocks();
      const { data: updatedStocks } = await supabase
      .from("stocks")
      .select("*");
      onUpdate(updatedStocks);
      if(showSnackbar) {
        showSnackbar("success",`${name}を在庫一覧に登録しました。`)
      }
    } catch (error) {
      // await getStocks();
      if(showSnackbar) {
        showSnackbar("error","データの新規登録ができません。")
      }
    }
  };

  const handleSelectItem = (event: SelectChangeEvent) => {
    setCategoryItem(event.target.value as string);
  };

  const handleTax = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTax(event.target.checked);
  };


  return (
    <Grid item xs={12} sx={{ marginBottom: "80px" }}>
    <Typography variant="h4" className="mb-4">
      在庫登録
    </Typography>
    <Box sx={{ paddingInline: "16px" }}>
      <form className="" onSubmit={handleForm}>
        <InputLabel>購入日</InputLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={{ maxWidth: "150px", marginBottom: "24px" }}
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
            <MenuItem value={"---"}>---</MenuItem>
            {Categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>

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
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography>税抜</Typography>
            <Switch checked={tax} onChange={handleTax} />
            <Typography>税込</Typography>
          </FormControl>
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
            <Button variant="outlined" type="submit">
              登録
            </Button>
          </div>
        </div>
      </form>
    </Box>
  </Grid>
  )
}

export default StockRegistration
