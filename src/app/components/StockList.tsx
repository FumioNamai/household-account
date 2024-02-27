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
import { Categories } from "./Categories";

import ja from "dayjs/locale/ja";
import Asynchronous from "./Asynchronous";
import { useState } from "react";
import ModalStockRegistration from "./ModalStockRegistration";
import { Dayjs } from "dayjs";
import useStore, { useTaxStore } from "@/store";
import Item from "@/app/components/item";

type Props = {
  groupedDataArr: any[] //要定義
  stocks: Stock[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
};

const StockList = ({
  groupedDataArr,
  stocks,
  setStocks,
  date,
  setDate,
}: Props) => {
  let [price, setPrice] = useState<string>("");
  const { user } = useStore();
  const { tax, setTax } = useTaxStore();
  const handleTax = () => {
    setTax();
  };

  const selectedDate: string | undefined = date
    ?.locale(ja)
    .format("YYYY-MM-DD");


  return (
    <Grid item xs={12} sx={{ marginBottom: "80px" }}>
      <Typography variant="h2" sx={{ fontSize: "24px", marginBottom: "24px" }}>
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
                  {groupedDataArr!
                    .sort((a, b) => a.name.localeCompare(b.name, "ja"))
                    .map((groupedData: Stock) => (
                      <AccordionDetails
                        key={groupedData.id}
                        sx={{
                          paddingBlock: "0",
                          paddingInline: "4px",
                          boxShadow: 1,
                        }}
                      >
                        {groupedData.user_id === user.id &&
                        groupedData.type === "食品" &&
                        groupedData.category === category &&
                        groupedData.use_date === null ? (
                          <Item
                          count={groupedData.count}
                            id={groupedData.id}
                            name={groupedData.name}
                            price={groupedData.price.toString()}
                            setPrice={setPrice}
                            type={groupedData.type}
                            stocks={stocks}
                            setStocks={setStocks}
                            date={selectedDate}
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
            {groupedDataArr!
              .sort((a, b) => b.id - a.id)
              .map((groupedData) => (
                <AccordionDetails
                  key={groupedData.id}
                  sx={{ paddingBlock: "0", paddingInline: "8px", boxShadow: 1 }}
                >
                  {
                  // groupedData.user_id === user.id &&
                  groupedData.type === "雑貨" &&
                  groupedData.use_date === null ? (
                    <Item
                    count={groupedData.count}
                      id={groupedData.id}
                      name={groupedData.name}
                      price={groupedData.price.toString()}
                      setPrice={setPrice}
                      type={groupedData.type}
                      stocks={stocks}
                      setStocks={setStocks}
                      date={selectedDate}
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
            {groupedDataArr!
              .sort((a, b) => b.id - a.id)
              .map((groupedData) => (
                <AccordionDetails
                  key={groupedData.id}
                  sx={{ paddingBlock: "0", paddingInline: "4px", boxShadow: 1 }}
                >
                  {
                  // stock.user_id === user.id &&
                  groupedData.type === "その他" &&
                  groupedData.use_date === null ? (
                    <AccordionDetails
                      key={groupedData.id}
                      sx={{
                        paddingBlock: "0",
                        paddingInline: "4px",
                        // boxShadow: 1,
                      }}
                    >
                      <Item
                      count={groupedData.count}
                        id={groupedData.id}
                        name={groupedData.name}
                        price={groupedData.price.toString()}
                        setPrice={setPrice}
                        type={groupedData.type}
                        stocks={stocks}
                        setStocks={setStocks}
                        date={selectedDate}
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
