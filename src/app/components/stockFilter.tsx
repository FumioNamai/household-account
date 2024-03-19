import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Categories } from "@/app/components/Categories";
import { Types } from "@/app/components/types";
import Item from "./item";
import { GroupedData, Stock } from "../../../utils/type";
import ja from "dayjs/locale/ja";
import { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ModalStockRegistration from "./ModalStockRegistration";
import TaxSwitch from "@/app/components/taxSwitch";

type Props = {
  countStocks: GroupedData[]
  stocks: Stock[] | null;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
};

const StockFilter = ({ countStocks,stocks, setStocks, date, setDate }: Props) => {
  const selectedDate: string | undefined = date
    ?.locale(ja)
    .format("YYYY-MM-DD");
  const [selectedType, setSelectedType] = useState<string>("");
  const [categoryItem, setCategoryItem] = useState("");
  const [searchName, setSearchName] = useState<string>("");

  const handleSelectType = (event, newType: string) => {
    setSelectedType(newType)
    setCategoryItem("")
  }
  console.log(selectedType,categoryItem);

  const handleSelectCategory = (event: SelectChangeEvent) => {
    setCategoryItem(event.target.value as string);
  };

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  const handleDelete = () => {
    setSearchName("")
  }
  // console.log(countStocks);
  // const result = Object.groupBy(countStocks,(countStocks) =>
  //   selectedType === "食品" ?
  //   countStocks.category === categoryItem
  //   :
  //   countStocks.type === selectedType && countStocks.category === ""
  // )



  const groupedStocks = Object.groupBy(countStocks, (countStock) =>
  categoryItem === "すべて" ? countStock.type === selectedType :
  countStock.type === selectedType &&
  countStock.category === categoryItem
  )
  console.log(groupedStocks.true);
console.log(categoryItem);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Typography variant="h2" sx={{ fontSize: "24px" }}>
          在庫検索
        </Typography>

        {/* 在庫登録 */}
        <ModalStockRegistration
          stocks={stocks}
          setStocks={setStocks}
          date={date}
          setDate={setDate}
        />
      </Box>

      {/* 使用日指定 */}
      <Box sx={{ width: "200px", marginBottom: "20px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={"使用日"}
            sx={{ maxWidth: "200px" }}
            value={date}
            format="YYYY年MM月DD日"
            onChange={setDate}
          />
        </LocalizationProvider>
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          指定された日付で登録します
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* 種別検索 */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <InputLabel>種別で検索</InputLabel>
          <ToggleButtonGroup
            color="primary"
            value={selectedType}
            exclusive
            onChange={handleSelectType}
            // onChange = {(event, newType) => setSelectedType(newType)}
            sx={{ marginBottom: "12px" }}
          >
            <ToggleButton value="食品">食品</ToggleButton>
            <ToggleButton value="雑貨">雑貨</ToggleButton>
            <ToggleButton value="その他">その他</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* 税表示切替 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            marginRight: "8px",
            paddingBottom: "4px",
            verticalAlign: "text-bottom",
          }}
        >
          <TaxSwitch />
        </Box>
      </Box>

      {/* 在庫一覧 */}
      {Types.map((type) =>
        selectedType === type ? (
          <Box
            key={type}
            sx={{
              boxShadow: 2,
              padding: "12px",
              borderRadius: 2,
              marginBottom: "40px",
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: "12px" }}>
              {type}
            </Typography>
            {type === "食品" && (
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
                  onChange={handleSelectCategory}
                >
                  <MenuItem value={""}></MenuItem>
                  {Categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {type === "食品" ? (
              Categories.map((category) =>
                category === categoryItem && (

                  <div key={category}>
                    <ul>
                      {groupedStocks.true.map((groupedStock) => (
                        <li key={groupedStock.id}>
                          <Item
                                id={groupedStock.id}
                                name={groupedStock.name}
                                price={groupedStock.price.toString()}
                                count={groupedStock.count}
                                type={groupedStock.type}
                                setStocks={setStocks}
                                date={selectedDate}
                              />
                        </li>
                      ))
                      }
                      {/* 食品の各カテゴリー */}
                      {/* {countStocks!
                        .sort((a, b) => a.name.localeCompare(b.name, "ja"))
                        .map((countStock) => (
                          <li key={countStock.id}> */}
                            {/* カテゴリー　!=　すべて */}
                            {/* { category !=="すべて" ?
                            countStock.type === type && countStock.category === category &&
                            countStock.use_date === null &&
                              <Item
                                id={countStock.id}
                                name={countStock.name}
                                price={countStock.price.toString()}
                                count={countStock.count}
                                type={countStock.type}
                                setStocks={setStocks}
                                date={selectedDate}
                              />
                            : */}
                          {/* カテゴリー　=　すべて */}
                            {/* countStock.type === type &&
                            countStock.use_date === null && (
                              <Item
                                id={countStock.id}
                                name={countStock.name}
                                price={countStock.price.toString()}
                                count={countStock.count}
                                type={countStock.type}
                                setStocks={setStocks}
                                date={selectedDate}
                              />
                            )}
                          </li>
                        ))} */}
                    </ul>
                  </div>
                )

              )
            ) : (
              <ul>
                {groupedStocks.true.map((groupedStock) => (
                        <li key={groupedStock.id}>
                          <Item
                                id={groupedStock.id}
                                name={groupedStock.name}
                                price={groupedStock.price.toString()}
                                count={groupedStock.count}
                                type={groupedStock.type}
                                setStocks={setStocks}
                                date={selectedDate}
                              />
                        </li>
                      ))}
                {/* {countStocks!
                  .sort((a, b) => a.name.localeCompare(b.name, "ja"))
                  .map((countStock) => (
                    <li key={countStock.id}>
                      {
                      countStock.type === type &&
                      countStock.use_date === null && (
                        <Item
                          id={countStock.id}
                          name={countStock.name}
                          price={countStock.price.toString()}
                          count={countStock.count}
                          type={countStock.type}
                          setStocks={setStocks}
                          date={selectedDate}
                        />
                      )}
                    </li>
                  ))} */}
              </ul>
            )}
          </Box>
        ) : null
      )}

      <FormControl sx={{ display:"flex", flexDirection:"row", marginBottom: "12px", gap:"10px"}}>
        <TextField
          label="すべての在庫から商品名で検索"
          type="text"
          id="name"
          name="name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{ width:"280px"}}
        />
        <Button
        variant="outlined"
        color="error"
        onClick={handleDelete}
        sx={{ padding:"0px", height:"42px",
        marginBlock:"auto"
      }}
        >消去</Button>
        </FormControl>
      {/* 商品名検索 */}
      <Box
        sx={{
          height: "500px",
          overflowY: "scroll",
          boxShadow: 2,
          padding: "12px",
          borderRadius: 2,
          marginBottom:"40px"
        }}
      >

        <ul>
          {countStocks!
            .filter(
              (countStock) => countStock.name === countStock.name.match(searchName)?.input
            )
            .sort((a, b) => a.name.localeCompare(b.name, "ja"))
            .map((countStock) => (
              <li key={countStock.id}>
                {
                countStock.use_date === null && (
                  <Item
                    id={countStock.id}
                    name={countStock.name}
                    price={countStock.price.toString()}
                    count={countStock.count}
                    type={countStock.type}
                    setStocks={setStocks}
                    date={selectedDate}
                  />
                )}
              </li>
            ))}
        </ul>
      </Box>
    </>
  );
};

export default StockFilter;
