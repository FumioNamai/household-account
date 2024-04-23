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
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Categories } from "./Categories";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSnackbarContext } from "@/providers/context-provider";
import React, { useState } from "react";
import { supabase } from "../../../utils/supabase";
import { GroupedData, Stock } from "../../../utils/type";
import { Dayjs } from "dayjs";
import ja from "dayjs/locale/ja";

import { useStore, useTaxStore } from "@/store";
import TaxSwitch from "@/app/components/TaxSwitch";
import RegistrationDateSelector from "./RegistrationDateSelector";
import { Types } from "./types";

type Props = {
  groupedDataArr: GroupedData[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
};

const StockRegistration = ({
  groupedDataArr,
  setStocks,
  date,
  setDate,
}: Props) => {
  const user = useStore((state) => state.user);
  const tax = useTaxStore((state) => state.tax);

  const { showSnackbar } = useSnackbarContext();

  const [type, setType] = useState<string>("食品");
  const [itemName, setItemName] = useState<string>("");
  const [amount, setAmount] = useState<string>("1");
  const amounts: string[] = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ];
  let [newPrice, setNewPrice] = useState<string>("");
  const [categoryItem, setCategoryItem] = useState("");
  const [, setIsFocus] = useState(false);

  const selectedDate: string | undefined = date
    ?.locale(ja)
    .format("YYYY-MM-DD");

  const onUpdate = (data: any | undefined) => setStocks(data);

  const handleSelectCategory = (event: SelectChangeEvent) => {
    setCategoryItem(event.target.value as string);
  };

  const handleItemNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPrice(event.target.value);
  };

  const handleAmountChange = (event: SelectChangeEvent) => {
    setAmount(event.target.value);
  };

  const handleForm = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!type) {
      if (showSnackbar) {
        showSnackbar("error", "種別を選択してください。");
      }
      return;
    }

    if (type === "食品" && categoryItem === "") {
      if (showSnackbar) {
        showSnackbar("error", "食品の分類を選択してください。");
      }
      return;
    }

    if (itemName.length === 0) {
      if (showSnackbar) {
        showSnackbar("error", "商品名を入力してください。");
      }
      return;
    }

    // 入力された商品名と価格を検索して、登録済みの場合は処理を中断させる
    const isStocked = groupedDataArr.some(
      (data: any) => data.name === itemName
      // && data.price === parseInt(newPrice ? newPrice : "0")
    );
    if (isStocked) {
      if (showSnackbar) {
        showSnackbar("error", "同じ名前の商品が在庫一覧に登録されています。");
      }
      return;
    }

    if (parseInt(amount) > 0) {
      if (!Number.isInteger(parseInt(newPrice)) || Number(newPrice) < 0) {
        if (showSnackbar) {
          showSnackbar("error", "価格を半角数字(整数)で入力してください。");
        }
        return;
      }
    }

    if (type === "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.08).toString();
    }
    if (type !== "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.1).toString();
    }

    try {
      if (amount === "0") {
        // 0個の在庫を登録する処理
        const { error } = await supabase.from("stocks").insert({
          type: type,
          name: itemName,
          price: 0,
          reference_price: 0,
          registration_date: selectedDate,
          category: categoryItem,
          user_id: user.id,
        });
        if (error) throw error;
        const { data } = await supabase
          .from("stocks")
          .select("*")
          .eq("user_id", user.id);
        onUpdate(data);
      } else {
        // １個以上の在庫を登録する処理
        for (let i = 0; i < parseInt(amount); i++) {
          const { error } = await supabase.from("stocks").insert({
            type: type,
            name: itemName,
            price: newPrice,
            reference_price: newPrice,
            registration_date: selectedDate,
            category: categoryItem,
            user_id: user.id,
          });
          if (error) throw error;
          const { data } = await supabase
            .from("stocks")
            .select("*")
            .eq("user_id", user.id);

          onUpdate(data);
        }
      }

      setItemName("");
      setNewPrice("");
      setCategoryItem("");
      if (showSnackbar) {
        showSnackbar(
          "success",
          `『${itemName}』を${amount}個、在庫一覧へ登録しました。`
        );
      }
    } catch (error) {
      if (showSnackbar) {
        showSnackbar("error", "データの新規登録ができません。");
      }
    }
  };

  return (
    <Box sx={{ marginBottom: "20px" }}>
      <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        在庫 / 商品登録
      </Typography>
      <Box sx={{ paddingInline: "0px" }}>
        <form onSubmit={handleForm}>
          <RegistrationDateSelector date={date} setDate={setDate} />

          <InputLabel id="type">種別</InputLabel>

          <ToggleButtonGroup
            // size="small"
            color="primary"
            value={type}
            exclusive
            onChange={(event, newType) => setType(newType)}
            sx={{ marginBottom: "12px" }}
          >
            {Types.map((type) => (
              <ToggleButton key={type} value={type} sx={{ width: "80px" }}>
                {type}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <FormControl
            disabled={type !== "食品"}
            sx={{ display: "flex", marginBottom: "12px" }}
          >
            <InputLabel>食品の分類</InputLabel>
            <Select
              id="category"
              sx={{ width: "238px" }}
              value={categoryItem}
              label="食品の分類"
              onChange={handleSelectCategory}
            >
              <MenuItem value={""}></MenuItem>
              {Categories.map(
                (category) =>
                  category !== "すべて" && (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  )
              )}
            </Select>
          </FormControl>

          <FormControl sx={{ marginBottom: "12px" }}>
            <TextField
              onFocus={() => setIsFocus(true)}
              label="商品名"
              variant="outlined"
              type="text"
              id="name"
              value={itemName}
              onChange={handleItemNameChange}
            />
          </FormControl>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ marginBottom: "24px" }}
          >
            <TaxSwitch />
            <TextField
              type="string"
              label="価格"
              id="outlined-start-adornment"
              sx={{ width: "116px" }}
              value={newPrice}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">円</InputAdornment>
                ),
              }}
              onChange={handlePriceChange}
              disabled={amount === "0" ? true : false}
            />

            <FormControl>
              <InputLabel id="amount">数量</InputLabel>
              <Select
                id="amount"
                type="number"
                value={amount}
                label="数量"
                onChange={handleAmountChange}
                sx={{ width: "80px" }}
              >
                {amounts.map((amount) => (
                  <MenuItem
                    key={amount}
                    value={amount}
                    sx={{ justifyContent: "center" }}
                  >
                    {amount}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="column">
            <Box>
              <Button variant="outlined" type="submit">
                在庫一覧に追加する
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default StockRegistration;
