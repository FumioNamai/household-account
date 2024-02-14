
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Stock } from "../../../utils/type";
import Item from "./Item";
import { Categories } from "./Categories";

import ja from "dayjs/locale/ja";
import Asynchronous from "./Asynchronous";
import { useState } from "react";
import ModalStockRegistration from "./ModalStockRegistration";
import { Dayjs } from "dayjs";
import useStore from "@/store";

type Props = {
  stocks: Stock[];
  setStocks:React.Dispatch<React.SetStateAction<Stock[]>>;
  // handleTax:(event: React.ChangeEvent<HTMLInputElement>) => void;
  del:(stocks: Stock[]) => void;
  date: Dayjs | null;
  setDate:React.Dispatch<React.SetStateAction<Dayjs | null>>;
}

const StockList = ({
  stocks,
  setStocks,
  // handleTax,
  del,
  date,
  setDate,
}: Props) => {
  const {user, tax, setTax } = useStore()
  const selectedDate: string | undefined = date?.locale(ja).format("YYYY-MM-DD");

  // stocksから取得したpriceの状態を管理
  let [price, setPrice] = useState<string>("");

  const handleTax = () => {
    setTax();
  };

  return (
    <Grid item xs={12} sx={{ marginBottom: "80px" }}>
      <Typography variant="h2" sx={{fontSize:"24px", marginBottom: "24px" }}>
        在庫一覧
      </Typography>

      {/* 在庫検索 */}
      <Asynchronous />

      {/* 在庫登録 */}
      <ModalStockRegistration
        stocks={stocks}
        setStocks={setStocks}
        date={date}
        setDate={setDate}
      />

      {/* 税表示切替 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginRight: "1rem",
        }}
      >
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* <Typography
        sx={{marginRight:"1rem"}}
        >金額表示設定</Typography> */}
          <Typography>税抜</Typography>
          <Switch checked={tax} onChange={handleTax} />
          <Typography>税込</Typography>
        </FormControl>
      </Box>

      <Accordion sx={{ boxShadow: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="category-content"
          id="category-header"
          sx={{ paddingInline: "4px" }}
        >
          食品
        </AccordionSummary>
        <AccordionDetails sx={{ paddingInline: "4px" }}>
          {Categories.map((category) => (
            <Accordion key={category}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="type-content"
                id="type-header"
                sx={{ paddingInline: "4px" }}
              >
                {category}
              </AccordionSummary>
              <div>
                <ul>
                  {stocks!
                    .sort((a, b) => a.name.localeCompare(b.name, "ja"))
                    .map((stock: Stock) => (
                      <AccordionDetails
                        key={stock.id}
                        sx={{
                          paddingBlock: "0",
                          paddingInline: "4px",
                          boxShadow: 1,
                        }}
                      >
                        {stock.user_id === user.id &&
                        stock.type === "食品" &&
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
                            onDelete={del}
                            date={selectedDate}
                            // tax={tax}
                          />
                        ) : null}
                      </AccordionDetails>
                    ))}
                </ul>
              </div>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ boxShadow: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="type-content"
          id="type-header"
          sx={{ paddingInline: "4px" }}
        >
          雑貨
        </AccordionSummary>
        <div>
          <ul>
            {stocks!
              .sort((a, b) => b.id - a.id)
              .map((stock: Stock) => (
                <AccordionDetails
                  key={stock.id}
                  sx={{ paddingBlock: "0", paddingInline: "8px", boxShadow: 1 }}
                >
                  {stock.user_id === user.id && stock.type === "雑貨" && stock.use_date === null ? (
                    <Item
                      id={stock.id}
                      name={stock.name}
                      price={stock.price.toString()}
                      setPrice={setPrice}
                      type={stock.type}
                      stocks={stocks}
                      setStocks={setStocks}
                      onDelete={del}
                      date={selectedDate}
                      // tax={tax}
                    />
                  ) : null}
                </AccordionDetails>
              ))}
          </ul>
        </div>
      </Accordion>
      <Accordion sx={{ boxShadow: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="type-content"
          id="type-header"
          sx={{ paddingInline: "4px" }}
        >
          その他
        </AccordionSummary>
        <div>
          <ul>
            {stocks!
              .sort((a, b) => b.id - a.id)
              .map((stock: Stock) => (
                <AccordionDetails
                  key={stock.id}
                  sx={{ paddingBlock: "0", paddingInline: "4px", boxShadow: 1 }}
                >
                  {stock.user_id === user.id && stock.type === "その他" && stock.use_date === null ? (
                    <AccordionDetails
                      key={stock.id}
                      sx={{
                        paddingBlock: "0",
                        paddingInline: "4px",
                        // boxShadow: 1,
                      }}
                    >
                      <Item
                        id={stock.id}
                        name={stock.name}
                        price={stock.price.toString()}
                        setPrice={setPrice}
                        type={stock.type}
                        stocks={stocks}
                        setStocks={setStocks}
                        onDelete={del}
                        date={selectedDate}
                        // tax={tax}
                      />
                    </AccordionDetails>
                  ) : null}
                </AccordionDetails>
              ))}
          </ul>
        </div>
      </Accordion>
    </Grid>
  );
};

export default StockList;
