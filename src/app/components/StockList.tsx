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

const StockList = ({
  stocks,
  setStocks,
  tax,
  setTax,
  handleTax,
  price,
  setPrice,
  del,
  date,
  setDate
}) => {
  const selectedDate = date?.locale(ja).format("YYYY-MM-DD");
  const [itemName, setItemName] = useState<string>("");

  return (
    <Grid item xs={12} sx={{ marginBottom: "80px" }}>
      <Typography variant="h4">在庫一覧</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
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

      {/* 在庫検索 */}
      <Asynchronous
        itemName={itemName}
        setItemName={setItemName}
        stocks={stocks}
        setStocks={setStocks}
      />

      {/* 在庫登録 */}
      <ModalStockRegistration
          stocks={stocks}
          setStocks={setStocks}
          tax={tax}
          setTax={setTax}
          price={price}
          setPrice={setPrice}
          date={date}
          setDate={setDate}
        />

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="category-content"
          id="category-header"
        >
          食品
        </AccordionSummary>
        <AccordionDetails>
          {Categories.map((category) => (
            <Accordion key={category}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="type-content"
                id="type-header"
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
                        sx={{ paddingBlock: "0" }}
                      >
                        {stock.type === "食品" &&
                        stock.category === category &&
                        stock.use_date === null ? (
                          <Item
                            id={stock.id}
                            name={stock.name}
                            price={stock.price}
                            setPrice={setPrice}
                            type={stock.type}
                            stocks={stocks}
                            setStocks={setStocks}
                            onDelete={del}
                            date={selectedDate}
                            tax={tax}
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
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="type-content"
          id="type-header"
        >
          雑貨
        </AccordionSummary>
        <div>
          <ul>
            {stocks!
              .sort((a, b) => b.id - a.id)
              .map((stock: Stock) => (
                <AccordionDetails key={stock.id} sx={{ paddingBlock: "0" }}>
                  {stock.type === "雑貨" && stock.use_date === null ? (
                    <Item
                      id={stock.id}
                      name={stock.name}
                      price={stock.price}
                      setPrice={setPrice}
                      type={stock.type}
                      stocks={stocks}
                      setStocks={setStocks}
                      onDelete={del}
                      date={selectedDate}
                      tax={tax}
                    />
                  ) : null}
                </AccordionDetails>
              ))}
          </ul>
        </div>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="type-content"
          id="type-header"
        >
          その他
        </AccordionSummary>
        <div>
          <ul>
            {stocks!
              .sort((a, b) => b.id - a.id)
              .map((stock: Stock) => (
                <AccordionDetails key={stock.id} sx={{ paddingBlock: "0" }}>
                  {stock.type === "その他" && stock.use_date === null ? (
                    <Item
                      id={stock.id}
                      name={stock.name}
                      price={stock.price}
                      setPrice={setPrice}
                      type={stock.type}
                      stocks={stocks}
                      setStocks={setStocks}
                      onDelete={del}
                      date={selectedDate}
                      tax={tax}
                    />
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
