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
import TaxSwitch from "@/app/components/taxSwitch";

// type Schema = z.infer<typeof schema>;

// 入力データの検証ルールを定義する
// const schema = z.object({
//   name: z.string().min(2, { message: "2文字以上入力する必要があります。" }),
//   introduce: z.string().min(0),
// });

type Props = {
  stocks: Stock[] | null;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
};

const StockRegistration = ({ stocks, setStocks, date, setDate }: Props) => {
  const { user } = useStore();
  const { tax, } = useTaxStore();

  const { showSnackbar } = useSnackbarContext();
  const [type, setType] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);
  const amounts: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let [newPrice, setNewPrice] = useState<string>("");
  const [categoryItem, setCategoryItem] = useState("");
  const [, setIsFocus] = useState(false);

  const selectedDate: string | undefined = date
  ?.locale(ja)
  .format("YYYY-MM-DD");
  const onUpdate = (data:any| undefined) => setStocks(data);

  const handleForm = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (type === "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.08).toString();
    }
    if (type !== "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.1).toString();
    }

    try {
      for (let i = 0; i < amount; i++) {
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
    }
      if (showSnackbar) {
        showSnackbar("success", `${itemName}を${amount}個、在庫一覧に登録しました。`);
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

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPrice(event.target.value);
  };

  const handleAmountChange = (event:any) => {
    setAmount(event.target.value)
  };

  return (
    <Grid item xs={12} sx={{ marginBottom: "20px" }}>
      <Typography variant="h4" sx={{marginBottom:"40px"}}>
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
          <ToggleButtonGroup
            // size="small"
            color="primary"
            value={type}
            exclusive
            onChange={(event, newType) => setType(newType)}
            sx={{ marginBottom: "12px" }}
          >
            <ToggleButton value="食品">食品</ToggleButton>
            <ToggleButton value="雑貨">雑貨</ToggleButton>
            <ToggleButton value="その他">その他</ToggleButton>
          </ToggleButtonGroup>

          <FormControl
            sx={{ display: "flex", marginBottom: "12px", width: 120 }}
          >
            <InputLabel>分類</InputLabel>
            <Select
              // disabled
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


          <div className="flex flex-row items-center gap-5 mb-3">
            <TextField
              type="string"
              label="価格"
              id="outlined-start-adornment"
              sx={{ width: "120px" }}
              value={newPrice}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">円</InputAdornment>
                ),
              }}
              onChange={handlePriceChange}
            />
            <TaxSwitch />
          </div>
          <FormControl sx={{marginBottom:"24px"}}>
            <InputLabel>数量</InputLabel>
            <Select
              id="amount"
              type="number"
              value={amount}
              label="数量"
              onChange={handleAmountChange}
            >
              {amounts.map((amount) => (
                <MenuItem key={amount} value={amount}>{amount}</MenuItem>
              ))}
            </Select>
            </FormControl>
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
  );
};

export default StockRegistration;
