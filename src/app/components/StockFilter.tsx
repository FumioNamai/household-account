import React, { useState } from "react";
import ja from "dayjs/locale/ja";
import { Dayjs } from "dayjs";
import {
  Box,
  Button,
  FormControl,
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { Categories } from "@/app/components/Categories";
import ModalStockRegistration from "@/app/components/ModalStockRegistration";
import Item from "./Item";
import TaxSwitch from "@/app/components/TaxSwitch";

import { Types } from "@/app/components/types";
import { GroupedData, Stock } from "../../../utils/type";

type Props = {
  groupedDataArr: GroupedData[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
};

const StockFilter = ({ groupedDataArr, setStocks, date, setDate }: Props) => {
  const selectedDate: string | undefined = date
    ?.locale(ja)
    .format("YYYY-MM-DD");
  const [selectedType, setSelectedType] = useState<string>("食品");
  const [categoryItem, setCategoryItem] = useState("");
  const [searchName, setSearchName] = useState<string>("");

  const handleSelectItem = (event: SelectChangeEvent) =>
    setCategoryItem(event.target.value as string);

  const handleDelete = () => setSearchName("");

  const handleSelectType = (event: any, newType: string) =>
    setSelectedType(newType);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          marginBottom: "24px",
        }}
      >
        <Typography variant="h2" sx={{ fontSize: "24px" }}>
          在庫一覧/検索
        </Typography>

        {/* 在庫登録 */}
        <ModalStockRegistration
          groupedDataArr={groupedDataArr}
          setStocks={setStocks}
          date={date}
          setDate={setDate}
        />
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          marginBottom: "20px",
        }}
      >
        {/* 使用日指定 */}
        <Box sx={{ width: "200px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={"使用日"}
              sx={{ maxWidth: "200px" }}
              value={date}
              format="YYYY年MM月DD日"
              onChange={setDate}
            />
          </LocalizationProvider>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", marginTop: "4px" }}
          >
            選択した日付で記録します
          </Typography>
        </Box>
      </Stack>

      {/* 在庫一覧 */}

      <Box
        sx={{
          boxShadow: 2,
          padding: "12px",
          borderRadius: 2,
          marginBottom: "40px",
        }}
      >
        {/* 種別検索 */}
        <InputLabel>種別で検索</InputLabel>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ToggleButtonGroup
            color="primary"
            value={selectedType}
            exclusive
            onChange={handleSelectType}
            sx={{ marginBlock: "12px" }}
          >
            {Types.map((type) => (
              <ToggleButton key={type} value={type} sx={{ width: "80px" }}>
                {type}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Button
            size="small"
            onClick={() => setSelectedType("")}
            color="error"
            variant="outlined"
            sx={{ height: "42px" }}
          >
            閉じる
          </Button>
        </Stack>

        {Types.map((type) =>
          selectedType === type ? (
            <Box key={type}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                {
                  //  分類検索
                  <FormControl
                    variant="standard"
                    sx={{
                      width: 140,
                    }}
                  >
                    <InputLabel>分類</InputLabel>
                    <Select
                      id="category"
                      value={categoryItem}
                      label="分類"
                      onChange={handleSelectItem}
                      disabled={type !== "食品" && true}
                    >
                      <MenuItem value={""}></MenuItem>
                      {Categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
                {/* 税表示切替 */}
                <TaxSwitch />
              </Stack>
              {type === "食品" ? (
                Categories.map(
                  (category) =>
                    category === categoryItem && (
                      <div key={category}>
                        <ul>
                          {groupedDataArr!
                            .sort((a, b) => a.name.localeCompare(b.name, "ja"))
                            .map((groupedData) => (
                              <li key={groupedData.id}>
                                {category !== "すべて"
                                  ? groupedData.type === type &&
                                    groupedData.category === category &&
                                    groupedData.use_date === null && (
                                      <Item
                                        id={groupedData.id}
                                        name={groupedData.name}
                                        price={groupedData.price}
                                        reference_price={
                                          groupedData.reference_price
                                        }
                                        count={groupedData.count}
                                        type={groupedData.type}
                                        setStocks={setStocks}
                                        selectedDate={selectedDate}
                                        to_buy={groupedData.to_buy}
                                      />
                                    )
                                  : groupedData.type === type &&
                                    groupedData.use_date === null && (
                                      <Item
                                        id={groupedData.id}
                                        name={groupedData.name}
                                        price={groupedData.price}
                                        reference_price={
                                          groupedData.reference_price
                                        }
                                        count={groupedData.count}
                                        type={groupedData.type}
                                        setStocks={setStocks}
                                        selectedDate={selectedDate}
                                        to_buy={groupedData.to_buy}
                                      />
                                    )}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )
                )
              ) : (
                <ul>
                  {groupedDataArr!
                    .sort((a, b) => a.name.localeCompare(b.name, "ja"))
                    .map((groupedData) => (
                      <li key={groupedData.id}>
                        {groupedData.type === type &&
                          groupedData.use_date === null && (
                            <Item
                              id={groupedData.id}
                              name={groupedData.name}
                              price={groupedData.price}
                              reference_price={groupedData.reference_price}
                              count={groupedData.count}
                              type={groupedData.type}
                              setStocks={setStocks}
                              selectedDate={selectedDate}
                              to_buy={groupedData.to_buy}
                            />
                          )}
                      </li>
                    ))}
                </ul>
              )}
            </Box>
          ) : null
        )}
      </Box>

      <FormControl
        sx={{
          display: "flex",
          flexDirection: "row",
          marginBottom: "12px",
          gap: "10px",
        }}
      >
        <TextField
          label="すべての在庫から商品名で検索"
          type="text"
          id="name"
          name="name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{ width: "280px" }}
        />
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          sx={{ padding: "0px", height: "42px", marginBlock: "auto" }}
        >
          消去
        </Button>
      </FormControl>

      {/* 税表示切替 */}
      <Stack
        direction="row"
        justifyContent="end"
        sx={{
          marginRight: "8px",
        }}
      >
        <TaxSwitch />
      </Stack>

      {/* 商品名検索 */}
      <Box
        sx={{
          height: "300px",
          overflowY: "scroll",
          boxShadow: 2,
          padding: "12px",
          borderRadius: 2,
          marginBottom: "40px",
        }}
      >
        {searchName !== "" ? (
          <ul>
            {groupedDataArr!
              .filter(
                (groupedData) =>
                  groupedData.name === groupedData.name.match(searchName)?.input
              )
              .sort((a, b) => a.name.localeCompare(b.name, "ja"))
              .map((groupedData) => (
                <li key={groupedData.id}>
                  {groupedData.use_date === null && (
                    <Item
                      id={groupedData.id}
                      name={groupedData.name}
                      price={groupedData.price}
                      reference_price={groupedData.reference_price}
                      count={groupedData.count}
                      type={groupedData.type}
                      setStocks={setStocks}
                      selectedDate={selectedDate}
                      to_buy={groupedData.to_buy}
                    />
                  )}
                </li>
              ))}
          </ul>
        ) : (
          "検索結果が表示されます"
        )}
      </Box>
    </>
  );
};

export default StockFilter;
