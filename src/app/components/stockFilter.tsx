import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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
import { getAllStocks } from "../../../utils/supabaseFunctions";

type Props = {
  groupedDataArr: any[] //要定義
  stocks: Stock[] | null;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
};

const StockFilter = ({ groupedDataArr,stocks, setStocks, date, setDate }: Props) => {
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

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  // useEffect(() => {
  //   let active = true;
  //   if (!loading) {
  //     return undefined;
  //   }

  //   (async () => {
  //     const stocks:Stock[] | null = await getAllStocks();
  //       if (stocks!.some((stock) => stock.user_id !== user.id )) {
  //         alert("在庫データがありません。在庫登録を行ってください。");
  //         setOpen(false)
  //       }
        // const filteredStocks = stocks!.filter((stock) => stock.user_id === user.id && stock.use_date === null)
        // 同じnameで、同じpriceのものはcount数で表示
        // const group = (arr: any | null, func = (v:any) => v, detail = false ) => {
        //   const index: string[] = [];
          // const result: [
          //   {
          //     id: number;
          //     type: string;
          //     name: string;
          //     length: number;
          //   }
          // ] = [{id: 0 , type:"", name:"", length }];

      //     const result: any = []
      //     arr!.forEach((v:any) => {
      //       const funcResult: string = func(v);
      //       const i:number = index.indexOf(funcResult);
      //       if (i === -1) {
      //         index.push(funcResult);
      //         result.push([v]);
      //       } else {
      //         result[i].push(v);
      //       }
      //     });
      //     if (detail) {
      //       return { index, result };
      //     }
      //     return result;
      //   };

      //   const groupedStocks = group(filteredStocks, (d) => d.name + d.price, true ).result.map(
      //     (e: any) => ({
      //       id: e[0].id,
      //       name: e[0].name,
      //       price: e[0].price,
      //       type: e [0].type,
      //       category: e[0].category,
      //       count: e.length,
      //     })
      //     )
      //     console.log(groupedStocks);
      //     if (active) {
      //       setOptions(groupedStocks);
      //     }
      //   })();

      //   return () => {
      //     active = false;
      //   };
      // }, [loading]);

      // React.useEffect(() => {
      //   if (!open) {
      //     setOptions([]);
      //   }
      // }, [open]);



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
            )}

            {type === "食品" ? (
              Categories.map((category) =>
                category === categoryItem ? (
                  <div key={category}>
                    <ul>
                      {groupedDataArr!
                        .sort((a, b) => a.name.localeCompare(b.name, "ja"))
                        .map((groupedData, index) => (
                          <li key={groupedData.name + groupedData.count + index}>
                            { category !=="すべて" ?
                            // stock.user_id === user.id &&
                            groupedData.type === type && groupedData.category === category &&
                            groupedData.use_date === null &&
                              <Item
                                id={groupedData.id}
                                name={groupedData.name}
                                price={groupedData.price.toString()}
                                count={groupedData.count}
                                setPrice={setPrice}
                                type={groupedData.type}
                                stocks={stocks}
                                setStocks={setStocks}
                                date={selectedDate}
                              />
                            :
                            // stock.user_id === user.id &&
                            groupedData.type === type &&
                            // stock.category === category && "全て"の場合はカテゴリーを絞らない
                            groupedData.use_date === null ? (
                              <Item
                                id={groupedData.id}
                                name={groupedData.name}
                                price={groupedData.price.toString()}
                                setPrice={setPrice}
                                count={groupedData.count}
                                type={groupedData.type}
                                stocks={stocks}
                                setStocks={setStocks}
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
                {groupedDataArr!
                  .sort((a, b) => a.name.localeCompare(b.name, "ja"))
                  .map((groupedData, index) => (
                    <li key={groupedData.name + groupedData.count + index}>
                      {
                      // stock.user_id === user.id &&
                      groupedData.type === type &&
                      groupedData.use_date === null ? (
                        <Item
                          id={groupedData.id}
                          name={groupedData.name}
                          price={groupedData.price.toString()}
                          setPrice={setPrice}
                          count={groupedData.count}
                          type={groupedData.type}
                          stocks={stocks}
                          setStocks={setStocks}
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

      <FormControl sx={{ marginBottom: "12px",width:"280px"}}>
      {/* <InputLabel>商品名で検索</InputLabel> */}
        <TextField
          // onFocus={() => setIsFocus(true)}
          label="すべての在庫から商品名で検索"
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

        <ul>
          {groupedDataArr!
            .filter(
              (groupedData) => groupedData.name === groupedData.name.match(searchName)?.input
            )
            .sort((a, b) => a.name.localeCompare(b.name, "ja"))
            .map((groupedData, index) => (
              <li key={groupedData.name + groupedData.count + index}>
                {
                // stock.user_id === user.id &&
                groupedData.use_date === null ? (
                  <Item
                    id={groupedData.id}
                    name={groupedData.name}
                    price={groupedData.price.toString()}
                    setPrice={setPrice}
                    count={groupedData.count}
                    type={groupedData.type}
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
