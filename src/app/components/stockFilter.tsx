import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Categories } from "@/app/components/Categories";
import { Types } from "@/app/components/types";
import Item from "./item";
import { Stock } from "../../../utils/type";
import useStore, { useTaxStore } from "@/store";
import ja from "dayjs/locale/ja";
import { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ModalStockRegistration from "./ModalStockRegistration";
import TaxSwitch from "@/app/components/taxSwitch";

type Props = {
  stocks: Stock[] | null;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
};

const StockFilter = ({ stocks, setStocks, date, setDate }: Props) => {
  const { user } = useStore();
  const selectedDate: string | undefined = date
    ?.locale(ja)
    .format("YYYY-MM-DD");
  let [price, setPrice] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [categoryItem, setCategoryItem] = useState("");
  const [searchName, setSearchName] = useState<string>("");

  const handleSelectItem = (event: SelectChangeEvent) => {
    setCategoryItem(event.target.value as string);
  };

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
            onChange={(event, newType) => setSelectedType(newType)}
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
            {type === "食品" ? (
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
                >
                  <MenuItem value={""}></MenuItem>
                  {Categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}

            {type === "食品" ? (
              Categories.map((category) =>
                category === categoryItem ? (
                  <div key={category}>
                    {/* <Typography variant="h6">{category}</Typography> */}
                    <ul>
                      {stocks!
                        .sort((a, b) => a.name.localeCompare(b.name, "ja"))
                        .map((stock) => (
                          <li key={stock.id}>
                            {stock.user_id === user.id &&
                            stock.type === type &&
                            stock.category === category &&
                            stock.use_date === null ? (
                              <Item
                                id={stock.id}
                                name={stock.name}
                                price={stock.price.toString()}
                                setPrice={setPrice}
                                type={stock.type}
                                stocks={stocks}
                                setStocks={setStocks}
                                // onDelete={del}
                                date={selectedDate}
                              />
                            ) : null}
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : null
              )
            ) : (
              <ul>
                {stocks!
                  .sort((a, b) => a.name.localeCompare(b.name, "ja"))
                  .map((stock) => (
                    <li key={stock.id}>
                      {stock.user_id === user.id &&
                      stock.type === type &&
                      stock.use_date === null ? (
                        <Item
                          id={stock.id}
                          name={stock.name}
                          price={stock.price.toString()}
                          setPrice={setPrice}
                          type={stock.type}
                          stocks={stocks}
                          setStocks={setStocks}
                          // onDelete={del}
                          date={selectedDate}
                        />
                      ) : null}
                    </li>
                  ))}
              </ul>
            )}
          </Box>
        ) : null
      )}

      <FormControl sx={{ marginBottom: "12px" }}>
      {/* <InputLabel>商品名で検索</InputLabel> */}
        <TextField
          // onFocus={() => setIsFocus(true)}
          label="商品名で検索"
          // variant="standard"
          type="text"
          id="name"
          name="name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
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
        {/* <FormControl sx={{ marginBottom: "12px" }}>
          <TextField
            // onFocus={() => setIsFocus(true)}
            label="商品名で検索"
            variant="standard"
            type="text"
            id="name"
            name="name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </FormControl> */}
        {/* <Typography variant="subtitle1">検索結果</Typography> */}
        <ul>
          {stocks!
            .filter(
              (stock) => stock.name === stock.name.match(searchName)?.input
            )
            .sort((a, b) => a.name.localeCompare(b.name, "ja"))
            .map((stock) => (
              <li key={stock.id}>
                {stock.user_id === user.id && stock.use_date === null ? (
                  <Item
                    id={stock.id}
                    name={stock.name}
                    price={stock.price.toString()}
                    setPrice={setPrice}
                    type={stock.type}
                    stocks={stocks}
                    setStocks={setStocks}
                    // onDelete={del}
                    date={selectedDate}
                  />
                ) : null}
              </li>
            ))}
        </ul>
      </Box>
    </>
  );
};

export default StockFilter;
