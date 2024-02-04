import { Box, FormControl, Grid, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import UsedItem from "./UsedItem"
import { Stock } from "../../../utils/type"
import ja from "dayjs/locale/ja";

const Daily = ({date, setDate, stocks, setStocks}) => {

  const selectedDate = date?.locale(ja).format("YYYY-MM-DD");

  const todayUsed: Stock[] = stocks!.filter(
    (stock: Stock) => stock.use_date === `${selectedDate}`
  );

  // その日に使用した食品の合計金額を算出
  const todayFoods = todayUsed.filter(
    (todayUsed: Stock) => todayUsed.type === "食品"
  );
  const todaysFoodsTotal = todayFoods.reduce((sum: number, el) => {
    return sum + el.price;
  }, 0);

  // その日に使用した雑貨の合計金額を算出
  const todayItems = todayUsed.filter(
    (todayUsed: Stock) => todayUsed.type === "雑貨"
  );
  const todaysItemsTotal = todayItems.reduce((sum: number, el) => {
    return sum + el.price;
  }, 0);

  // その日に使用した雑貨の合計金額を算出
  const todayOthers = todayUsed.filter(
    (todayUsed: Stock) => todayUsed.type === "その他"
  );
  const todaysOthersTotal = todayOthers.reduce((sum: number, el) => {
    return sum + el.price;
  }, 0);

  // その月に使用したその他の合計金額を算出

  // その日の合計金額を算出
  const total = todaysFoodsTotal + todaysItemsTotal + todaysOthersTotal;


  return(
    <Grid item xs={12} sx={{ marginBottom: "80px" }}>
          <Typography variant="h4" sx={{ marginBottom: "24px" }}>
            日別集計
          </Typography>
          {/* <Daily stocks={stocks}/> */}
          <Box sx={{ paddingInline: "1rem" }}>
            <Box>
              <FormControl sx={{ maxWidth: "150px", marginBottom: "24px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ maxWidth: "150px" }}
                    value={date}
                    // defaultValue={dayjs()}
                    format="YYYY/MM/DD"
                    onChange={(date) => setDate(date)}
                  />
                </LocalizationProvider>
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <Typography variant="h6">合計:</Typography>
                <Typography variant="h6" className=" w-24 text-right">
                  {total}円
                </Typography>
              </Box>

              <Typography variant="subtitle1">内訳</Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">食品:</Typography>
                <Typography variant="h6" className=" w-24 text-right">
                  {todaysFoodsTotal}円
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <Typography variant="h6">雑貨:</Typography>
                <Typography variant="h6" className=" w-24 text-right">
                  {todaysItemsTotal}円
                </Typography>
              </Box>

              <Box sx={{}}>
                <Typography variant="h6">消費品目</Typography>
                <Box>
                  <Typography variant="subtitle1">食品</Typography>
                  <ul>
                    {todayFoods.map((todayFood: Stock) => (
                      <div key={todayFood.id}>
                        {todayFood.type === "食品" &&
                        todayFood.use_date === `${selectedDate}` ? (
                          <UsedItem
                            id={todayFood.id}
                            name={todayFood.name}
                            price={todayFood.price}
                            stocks={stocks}
                            setStocks={setStocks}
                          />
                        ) : null}
                      </div>
                    ))}
                  </ul>
                </Box>

                <Box>
                  <Typography variant="subtitle1">雑貨</Typography>
                  <ul>
                    {todayItems.map((todayItem: Stock) => (
                      <div key={todayItem.id}>
                        {todayItem.type === "雑貨" &&
                        todayItem.use_date === `${selectedDate}` ? (
                          <UsedItem
                            id={todayItem.id}
                            name={todayItem.name}
                            price={todayItem.price}
                            stocks={stocks}
                            setStocks={setStocks}
                          />
                        ) : null}
                      </div>
                    ))}
                  </ul>
                </Box>

                <Box>
                  <Typography variant="subtitle1">その他</Typography>
                  <ul>
                    {todayOthers.map((todayOther: Stock) => (
                      <div key={todayOther.id}>
                        {todayOther.type === "その他" &&
                        todayOther.use_date === `${selectedDate}` ? (
                          <UsedItem
                            id={todayOther.id}
                            name={todayOther.name}
                            price={todayOther.price}
                            stocks={stocks}
                            setStocks={setStocks}
                          />
                        ) : null}
                      </div>
                    ))}
                  </ul>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
  )
}

export default Daily
