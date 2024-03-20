import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import UsedItem from "@/app/components/usedItem";
import { Stock } from "../../../utils/type";
import ja from "dayjs/locale/ja";
import { Dayjs } from "dayjs";
import useStore, { useTaxStore } from "@/store";
import TaxSwitch from "./taxSwitch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Props = {
  stocks: Stock[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
};

const Daily = ({ date, setDate, stocks, setStocks }: Props) => {
  const user = useStore((state) => (state.user));
  const tax = useTaxStore((state) => (state.tax));

  const selectedDate: string | undefined = date
    ?.locale(ja)
    .format("YYYY-MM-DD");

  const todayUsed: Stock[] = stocks!.filter(
    (stock: Stock) =>
      stock.user_id === user.id && stock.use_date === `${selectedDate}`
  );

  // その日に使用した食品の合計金額を算出
  const todayFoods: Stock[] = todayUsed.filter(
    (todayUsed: Stock) => todayUsed.type === "食品"
  );
  let todaysFoodsTotal: number = todayFoods.reduce((sum: number, el) => {
    return sum + el.price;
  }, 0);

  todaysFoodsTotal = tax
    ? todaysFoodsTotal
    : Math.ceil(todaysFoodsTotal / 1.08);

  // その日に使用した雑貨の合計金額を算出
  const todayItems: Stock[] = todayUsed.filter(
    (todayUsed: Stock) => todayUsed.type === "雑貨"
  );
  let todaysItemsTotal: number = todayItems.reduce((sum: number, el) => {
    return sum + el.price;
  }, 0);

  todaysItemsTotal = tax ? todaysItemsTotal : Math.ceil(todaysItemsTotal / 1.1);

  // その日に使用した雑貨の合計金額を算出
  const todayOthers: Stock[] = todayUsed.filter(
    (todayUsed: Stock) => todayUsed.type === "その他"
  );
  let todaysOthersTotal: number = todayOthers.reduce((sum: number, el) => {
    return sum + el.price;
  }, 0);

  todaysOthersTotal = tax
    ? todaysOthersTotal
    : Math.ceil(todaysOthersTotal / 1.1);

  // その月に使用したその他の合計金額を算出

  // その日の合計金額を算出
  const total: number = todaysFoodsTotal + todaysItemsTotal + todaysOthersTotal;

  return (
    <Grid item xs={12} sx={{ marginBottom: "80px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
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
      </Box>

      {/* 税表示切替 */}
      <Box sx={{ display: "flex", justifyContent: "end", marginRight: "8px" }}>
        <TaxSwitch />
      </Box>

      <Box sx={{ paddingInline: "16px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Typography variant="h6">合計</Typography>
          <Typography variant="h6" sx={{ width: "6rem", textAlign: "right" }}>
            {total}円
          </Typography>
        </Box>

        <Typography variant="subtitle1">内訳</Typography>
        <Box sx={{ pl: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1">食品</Typography>
            <Typography
              variant="body1"
              sx={{ width: "6rem", textAlign: "right" }}
            >
              {todaysFoodsTotal}円
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1">雑貨</Typography>
            <Typography
              variant="body1"
              sx={{ width: "6rem", textAlign: "right" }}
            >
              {todaysItemsTotal}円
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <Typography variant="body1">その他</Typography>
            <Typography
              variant="body1"
              sx={{ width: "6rem", textAlign: "right" }}
            >
              {todaysOthersTotal}円
            </Typography>
          </Box>
        </Box>
      </Box>

      <Accordion square={true}>
        <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ fontWeight:"400" }}>
          消費品目
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1">
            食品
          </Typography>
          <ul>
            {todayFoods.map((todayFood: Stock) => (
              <div key={todayFood.id}>
                {todayFood.type === "食品" &&
                todayFood.use_date === `${selectedDate}` && (
                  <UsedItem
                    id={todayFood.id}
                    name={todayFood.name}
                    price={
                      tax ? todayFood.price : Math.ceil(todayFood.price / 1.08)
                    }
                    stocks={stocks}
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
                    price={
                      tax ? todayItem.price : Math.ceil(todayItem.price / 1.1)
                    }
                    stocks={stocks}
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
                    price={
                      tax ? todayOther.price : Math.ceil(todayOther.price / 1.1)
                    }
                    stocks={stocks}
                    setStocks={setStocks}
                  />
                )}
              </div>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default Daily;
