import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Stock } from "../../../utils/type";
import useStore, { useDateStore, useStockStore } from "@/store";
import TaxSwitch from "@/app/components/TaxSwitch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CalcPrice } from "./CalcPrice";
import { ListUsedItemByType } from "./ListUsedItemByType";
import { Breakdown } from "./Breakdown";

const Daily = () => {
  const user = useStore((state) => state.user);
  const {date,setDate,selectedDate} = useDateStore()
  let {stocks} = useStockStore()


  // 指定した日に使用した商品を取得
  const todayUsed: Stock[] = stocks!.filter(
    (stock: Stock) =>
      stock.user_id === user.id && stock.use_date === `${selectedDate}`
  );
  const todayFoods: Stock[] = [];
  const todayItems: Stock[] = [];
  const todayOthers: Stock[] = [];
  // typeごとに振り分け
  todayUsed.forEach((stock: Stock) => {
    switch (stock.type) {
      case "食品":
        todayFoods.push(stock);
        break;
      case "雑貨":
        todayItems.push(stock);
        break;
      case "その他":
        todayOthers.push(stock);
        break;
    }
  });

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
  const total: number =
    CalcPrice(dailyFoodsTotal, "食品") +
    CalcPrice(dailyItemsTotal, "雑貨") +
    CalcPrice(dailyOthersTotal, "その他");

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

      <Box sx={{ marginBottom:"24px", paddingInline: "16px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            marginBottom: "16px",
          }}
        >
          <Typography variant="h6">合計</Typography>
          <Typography variant="h6" sx={{ width: "6rem", textAlign: "right" }}>
            {total}円
          </Typography>
        </Stack>

        <Typography variant="subtitle1">内訳</Typography>
        <Box sx={{ paddingLeft: 2 }}>
          <Breakdown typeName="食品" totalPrice={dailyFoodsTotal} />
          <Breakdown typeName="雑貨" totalPrice={dailyItemsTotal} />
          <Breakdown typeName="その他" totalPrice={dailyOthersTotal} />
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
          <ListUsedItemByType
            typeName="食品"
            todayUsedItems={todayFoods}
          />
          <ListUsedItemByType
            typeName="雑貨"
            todayUsedItems={todayItems}

          />
          <ListUsedItemByType
            typeName="その他"
            todayUsedItems={todayOthers}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Daily;
