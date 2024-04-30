import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import UsedItem from "@/app/components/UsedItem";
import { Stock } from "../../../utils/type";
import ja from "dayjs/locale/ja";
import { Dayjs } from "dayjs";
import useStore, { useTaxStore } from "@/store";
import TaxSwitch from "@/app/components/TaxSwitch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CalcPrice } from "./CalcPrice";

type Props = {
  stocks: Stock[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
};

const Daily = ({ date, setDate, stocks, setStocks }: Props) => {
  const user = useStore((state) => state.user);
  const selectedDate: string | undefined = date
    ?.locale(ja)
    .format("YYYY-MM-DD");

  // 指定した日に使用した商品を取得
  const todayUsed: Stock[] = stocks!.filter(
    (stock: Stock) =>
      stock.user_id === user.id && stock.use_date === `${selectedDate}`
  );
  const todayFoods: Stock[] = []
  const todayItems: Stock[] = []
  const todayOthers: Stock[] = []
  // typeごとに振り分け
  todayUsed.forEach((stock:Stock) => {
    switch (stock.type) {
      case "食品":
      todayFoods.push(stock)
      break;
      case "雑貨":
      todayItems.push(stock)
      break
      case "その他":
      todayOthers.push(stock);
      break
    }
  })

  // 指定した日に使用した商品の合計金額を算出する関数
  const calcDailyTypeTotal = (type: Stock[]): number => {
    let dailyTypeTotal = type.reduce((sum: number, el) => {
      return sum + el.price;
    }, 0);
    return dailyTypeTotal;
  };
  // 指定した日に使用した食品の合計金額を算出
  const dailyFoodsTotal = calcDailyTypeTotal(todayFoods);

  // 指定した日に使用した雑貨の合計金額を算出
  const dailyItemsTotal = calcDailyTypeTotal(todayOthers);

  // 指定した日に使用した雑貨の合計金額を算出
  const dailyOthersTotal = calcDailyTypeTotal(todayItems);

  // 指定した日の合計金額を算出
  const total: number = CalcPrice(dailyFoodsTotal,"食品") + CalcPrice(dailyItemsTotal,"雑貨") + CalcPrice(dailyOthersTotal,"その他");

  return (
    <Box sx={{ marginBottom: "80px" }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={4}
        sx={{
          marginBottom: "16px",
        }}
      >
        <Typography variant="h2" sx={{ fontSize: "24px" }}>
          日別集計
        </Typography>
        <FormControl sx={{ maxWidth: "200px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ maxWidth: "200px" }}
              value={date}
              label={"対象年月日"}
              format="YYYY年MM月DD日"
              onChange={(date) => setDate(date)}
            />
          </LocalizationProvider>
        </FormControl>
      </Stack>

      {/* 税表示切替 */}
      <Stack direction="row" justifyContent="end" sx={{ marginRight: "8px" }}>
        <TaxSwitch />
      </Stack>

      <Box sx={{ paddingInline: "16px" }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">合計</Typography>
          <Typography variant="h6" sx={{ width: "6rem", textAlign: "right" }}>
            {total}円
          </Typography>
        </Stack>

        <Typography variant="subtitle1">内訳</Typography>
        <Box sx={{ pl: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1">食品</Typography>
            <Typography
              variant="body1"
              sx={{ width: "6rem", textAlign: "right" }}
            >
              {CalcPrice(dailyFoodsTotal,"食品")}円
            </Typography>
          </Box>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">雑貨</Typography>
            <Typography
              variant="body1"
              sx={{ width: "6rem", textAlign: "right" }}
            >
              {CalcPrice(dailyItemsTotal,"雑貨")}円
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              marginBottom: "12px",
            }}
          >
            <Typography variant="body1">その他</Typography>
            <Typography
              variant="body1"
              sx={{ width: "6rem", textAlign: "right" }}
            >
              {CalcPrice(dailyOthersTotal,"その他")}円
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Accordion square={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ fontWeight: "400" }}
        >
          消費品目
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1">食品</Typography>
          <ul>
            {todayFoods.map((todayFood: Stock) => (
              <div key={todayFood.id}>
                {todayFood.type === "食品" &&
                  todayFood.use_date === `${selectedDate}` && (
                    <UsedItem
                      id={todayFood.id}
                      name={todayFood.name}
                      price={todayFood.price}
                      type={todayFood.type}
                      setStocks={setStocks}
                    />
                  )}
              </div>
            ))}
          </ul>

          <Typography variant="subtitle1">雑貨</Typography>
          <ul>
            {todayItems.map((todayItem: Stock) => (
              <div key={todayItem.id}>
                {todayItem.type === "雑貨" &&
                  todayItem.use_date === `${selectedDate}` && (
                    <UsedItem
                      id={todayItem.id}
                      name={todayItem.name}
                      price={todayItem.price}
                      type={todayItem.type}
                      setStocks={setStocks}
                    />
                  )}
              </div>
            ))}
          </ul>

          <Typography variant="subtitle1">その他</Typography>
          <ul>
            {todayOthers.map((todayOther: Stock) => (
              <div key={todayOther.id}>
                {todayOther.type === "その他" &&
                  todayOther.use_date === `${selectedDate}` && (
                    <UsedItem
                      id={todayOther.id}
                      name={todayOther.name}
                      price={todayOther.price}
                      type={todayOther.type}
                      setStocks={setStocks}
                    />
                  )}
              </div>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Daily;
