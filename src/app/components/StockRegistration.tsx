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
import { useStore, useTaxStore } from "@/store";

// type Schema = z.infer<typeof schema>;

// 入力データの検証ルールを定義する
// const schema = z.object({
//   name: z.string().min(2, { message: "2文字以上入力する必要があります。" }),
//   introduce: z.string().min(0),
// });

type Props = {
  stocks: Stock[];
  setStocks:React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate:React.Dispatch<React.SetStateAction<Dayjs | null>>;
}

const StockRegistration = ({ stocks, setStocks, date, setDate }: Props) => {
  const { user} = useStore()
  const { tax, setTax } = useTaxStore()

  const { showSnackbar } = useSnackbarContext();
  const [type, setType] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  // let [date, setDate] = React.useState<Dayjs | null>(dayjs());
  let [newPrice, setNewPrice] = useState<string>("");
  const [categoryItem, setCategoryItem] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const onUpdate = (data: any | undefined) => setStocks(stocks);
  const selectedDate: string | undefined = date?.locale(ja).format("YYYY-MM-DD");

  const handleForm = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (type === "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.08).toString();
    }
    if (type !== "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.1).toString();
    }
    try {
      const { error } = await supabase.from("stocks").insert({
        type: type,
        name: itemName,
        price: newPrice,
        registration_date: selectedDate,
        category: categoryItem,
        user_id: user.id,
      });
      if (error) throw error;

      const { data } = await supabase.from("stocks").select("*");
      onUpdate(data);
      setItemName("");
      setNewPrice("");
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

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPrice(event.target.value)
  }

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
    <Grid item xs={12} sx={{ marginBottom: "20px" }}>
      <Typography variant="h4" className="mb-4">
        在庫登録
      </Typography>
      <Box sx={{ paddingInline: "0px" }}>
        <form className="" onSubmit={handleForm}>
          <InputLabel>購入日</InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ maxWidth: "180px", marginBottom: "12px" }}
              value={date}
              format="YYYY/MM/DD"
              onChange={setDate}
            />
          </LocalizationProvider>

          <InputLabel>種別</InputLabel>
          {/* <div className="flex flex-row items-center gap-2"> */}
            <ToggleButtonGroup
              // size="small"
              color="primary"
              value={type}
              exclusive
              onChange={(event, newType) => setType(newType)}
              sx={{marginBottom:"12px"}}
            >
              <ToggleButton value="食品">食品</ToggleButton>
              <ToggleButton value="雑貨">雑貨</ToggleButton>
              <ToggleButton value="その他">その他</ToggleButton>
            </ToggleButtonGroup>
          {/* </div> */}

          {/* <p>分類</p> */}
          <FormControl sx={{display:"flex", marginBottom: "12px", width: 120}}>
            <InputLabel>分類</InputLabel>
            <Select
              id="category"
              value={categoryItem}
              label="分類"
              onChange={handleSelectItem}
            >
              <MenuItem value={""}></MenuItem>
              {Categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ marginBottom: "12px" }}>
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
          {/* <Asynchronous
              onChange={(e) => setItemName(e.target.value)}
            itemName={itemName}
            setItemName={setItemName}
            stocks={stocks}
            setStocks={setStocks}
          /> */}

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
          <div className="flex flex-row items-center gap-5 my-3">

          <TextField
              type="string"
              label="価格"
              id="outlined-start-adornment"
              sx={{ width: "150px" }}
              value={newPrice}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">円</InputAdornment>
                ),
              }}
              onChange={handlePriceChange}
            />

            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="body2">税抜</Typography>
              <Switch checked={tax} onChange={handleTax} />
              {/* <Switch checked={tax} onChange={setTax} /> */}
              <Typography variant="body2">税込</Typography>
            </FormControl>

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
