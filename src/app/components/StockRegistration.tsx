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
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Categories } from "./Categories";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSnackbarContext } from "@/providers/context-provider";
import React, { useState } from "react";
import { supabase } from "../../../utils/supabase";
import { Stock } from "../../../utils/type";
import dayjs, { Dayjs } from "dayjs";
import ja from "dayjs/locale/ja";
import Asynchronous from "./Asynchronous";
import useStore from "@/store";


type Props = {
  stocks: Stock[];
  setStocks:React.Dispatch<React.SetStateAction<Stock[]>>;
}

const StockRegistration = ({ stocks, setStocks }: Props) => {
  const { user, tax, setTax } = useStore()

  const { showSnackbar } = useSnackbarContext();
  const [type, setType] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  let [date, setDate] = React.useState<Dayjs | null>(dayjs());
  let [price, setPrice] = useState<string>("");
  // const [tax, setTax] = useState(true);
  const [categoryItem, setCategoryItem] = useState("---");

  const [isFocus, setIsFocus] = useState(false);
  // const [suggestions, setSuggestions] = useState([]);
  const onUpdate = (stocks: Stock[]) => setStocks(stocks);

  const selectedDate: string | undefined = date?.locale(ja).format("YYYY-MM-DD");

  const handleForm = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (type === "食品" && tax === false) {
      price = Math.floor(parseInt(price) * 1.08).toString();
    }
    if (type !== "食品" && tax === false) {
      price = Math.floor(parseInt(price) * 1.1).toString();
    }
    try {
      const { error } = await supabase.from("stocks").insert({
        type: type,
        name: itemName,
        price: price,
        registration_date: selectedDate,
        category: categoryItem,
        user_id: user.id,
      });
      if (error) throw error;

      const { data: updatedStocks } = await supabase.from("stocks").select("*");
      onUpdate(updatedStocks);
      // setType("");
      setItemName("");
      setPrice("");
      setCategoryItem("");
      if (showSnackbar) {
        showSnackbar("success", `${itemName}を在庫一覧に登録しました。`);
      }
    } catch (error) {
      if (showSnackbar) {
        showSnackbar("error", "データの新規登録ができません。");
      }
    }
  };

  const handleSelectItem = (event: SelectChangeEvent) => {
    setCategoryItem(event.target.value as string);
  };

  const handleTax = () => {
    setTax();
  };

  // 在庫検索機能
  // const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   (pname) => {
  //     let matches = [];
  //     if (pname.length > 0) {
  //       matches = stocks.filter((stock) => {
  //         const regex = new RegExp(`${pname}`, "gi");
  //         return stock.name.match(regex);
  //       });
  //     }
  //     setSuggestions(matches);
  //     setPName(pname);
  //   };
  // }
  return (
    <Grid item xs={12} sx={{ marginBottom: "80px" }}>
      <Typography variant="h4" className="mb-4">
        在庫登録
      </Typography>
      <Box sx={{ paddingInline: "0px" }}>
        <form className="" onSubmit={handleForm}>
          <InputLabel>購入日</InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ maxWidth: "180px", marginBottom: "24px" }}
              value={date}
              format="YYYY/MM/DD"
              onChange={setDate}
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
            >
              <MenuItem value={"---"}>---</MenuItem>
              {Categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ my: 2 }}>
            <TextField
              onFocus={() => setIsFocus(true)}
              label="商品名"
              variant="outlined"
              type="text"
              id="name"
              name="name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </FormControl>

          {/* 在庫検索 */}
          <Asynchronous
            itemName={itemName}
            setItemName={setItemName}
            stocks={stocks}
            setStocks={setStocks}
          />

          {/* {isFocus && (
            <List
              sx={{
                cursor: "pointer",
                width: "300px",
                maxHeight: "200px",
                overflow: "scroll",
                bgcolor: "gray",
                zIndex: "100",
              }}
            >
              {suggestions?.map((suggestion) => (
                <ListItem
                  key={suggestion.id}
                  value={suggestion.name}
                  onClick={() => {
                    setPName(suggestion.name);
                    setIsFocus(false);
                  }}
                >
                  {suggestion.name}
                </ListItem>
              ))}
            </List>
          )} */}

          {/* <Asynchronous pname={pname} setPName={setPName} stocks={stocks} setStocks={setStocks} /> */}
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
              {/* <Switch checked={tax} onChange={setTax} /> */}

              <Typography>税込</Typography>
            </FormControl>
            <TextField
              type="number"
              label="価格"
              id="outlined-start-adornment"
              sx={{ m: 1, width: "12ch" }}
              value={price}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">円</InputAdornment>
                ),
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPrice(event.target.value);
              }}
              // onChange={setPrice}
            />
          </div>

          <div className="flex flex-col">
            <div>
              <Button variant="outlined" type="submit">
                登録
              </Button>
            </div>
            {/* <Box sx={{height: "50px"}}>
              {showStocks.map((stock) => {
                return (
                  <div key={stock.id}>{stock.name}</div>
                )
              })}
        </Box> */}
          </div>
        </form>
      </Box>
    </Grid>
  );
};

export default StockRegistration;
