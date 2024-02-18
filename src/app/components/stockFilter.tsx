import { useState } from "react";
import {
  Box,
  FormControl,
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

type Props = {
  stocks: Stock[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
};

const StockFilter = ({ stocks, setStocks, date, setDate }: Props) => {
  const { user } = useStore();
  const { tax, setTax } = useTaxStore();
  const selectedDate: string | undefined = date
    ?.locale(ja)
    .format("YYYY-MM-DD");
  let [price, setPrice] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [categoryItem, setCategoryItem] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [itemName, setItemName] = useState<string>("");

  // const handleForm = () => {};
  const handleSelectItem = (event: SelectChangeEvent) => {
    setCategoryItem(event.target.value as string);
  };

  const handleTax = () => {
    setTax();
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

      {/* 種別検索 */}
      <Box sx={{ paddingInline: "0px", marginBottom: "40px" }}>
          <InputLabel>種別</InputLabel>
        <Box sx={{ display: "flex", flexDirection: "row", gap:2}}>
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

          {/* 分類検索 */}
          <FormControl
            sx={{ display: "flex", marginBottom: "12px", width: 140 }}
          >
            <InputLabel>分類（食品）</InputLabel>
            <Select
              id="category"
              value={categoryItem}
              label="分類（食品）"
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
        </Box>

        {/* 商品名検索 */}
        {/* <FormControl sx={{ marginBottom: "12px" }}>
          <TextField
            onFocus={() => setIsFocus(true)}
            label="商品名検索"
            variant="outlined"
            type="text"
            id="name"
            name="name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </FormControl> */}

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
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            指定された日付で登録します
          </Typography>
        </Box>

        {/* 税表示切替 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            marginRight: "8px",
          }}
        >
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
        </Box>

        {/* 在庫一覧 */}
        {Types.map((type) =>
          selectedType === type ? (
            <Box key={type} sx={{ boxShadow: 2, padding: "4px", borderRadius:2}}>
              <Typography variant="h5" sx={{marginBlock:"8px"}}>{type}</Typography>
              {type === "食品" ? (
                Categories.map((category) =>
                  category === categoryItem ? (
                    <div key={category}>
                      <Typography variant="h6">{category}</Typography>
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
      </Box>
    </>
  );
};

export default StockFilter;
