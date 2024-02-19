import React, { useState } from "react";
import { Stock } from "../../../utils/type";
import { supabase } from "../../../utils/supabase";
import {
  Box,
  IconButton,
  List,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbarContext } from "@/providers/context-provider";
import { CheckCircleTwoTone, DeleteTwoTone, ModeTwoTone } from "@mui/icons-material";
import useStore, { useTaxStore } from "@/store";

type Props = {
  id: number;
  name: string;
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  stocks: Stock[] | null;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  // onDelete:(stocks: Stock[]) => void;
  date: string | undefined | null;
  // tax: boolean;
}

const Item = ({
  id,
  name,
  price,
  // setPrice,
  type,
  // stocks,
  setStocks,
  date,
  // tax,
} : Props) => {
  const { showSnackbar } = useSnackbarContext()
  let [newPrice, setNewPrice] = useState<string>("");
  const { tax } = useTaxStore()
  const onUpdate = (data: any | undefined) => setStocks(data);

  // UPDATE 使った日をuse_dateに記録する
  const handleUse = async (propsID: number) => {
    if (date !== undefined) {
      try {
        // 使うボタンで選択した項目をnewStockへコピー
        const { data: restocks} = await supabase
          .from("stocks")
          .select()
          .eq("id", propsID);
        const newStock = {
          id: undefined,
          type: restocks![0].type,
          category: restocks![0].category,
          name: restocks![0].name,
          user_id: restocks![0].user_id,
          price: 0,
          registration_date: null,
          use_date: null,
        };

        // 使うボタン押下でuse_dateに記録してdailyに移動
        await supabase
          .from("stocks")
          .update({ use_date: date })
          .eq("id", propsID);

        // newStockを在庫に登録（使うボタンで選択した項目を複製して在庫リストに残す）
        await supabase.from("stocks").insert({ ...newStock });

        // 在庫データを更新して、画面を更新
        const { data } = await supabase
        .from("stocks")
        .select("*");

        onUpdate( data );
        if(showSnackbar){
          showSnackbar("success", `${name}を${date}付けで計上しました。`)
        }
      } catch (error : any ) {
        if(showSnackbar){
          showSnackbar("error", "使用日登録ができませんでした。" + error.message)
        }
      }
    } else {
      if(showSnackbar){
        showSnackbar("error", "日付を選択してください。")
      }
    }
  };

  const handleDelete = async (propsID: number) => {
    try {
      const { error } = await supabase
        .from("stocks")
        .delete()
        .eq("id", propsID);
        if(error) throw error
      const { data: updatedStocks } = await supabase.from("stocks").select("*");
      onUpdate(updatedStocks);

      // 親コンポーネントにstocksを渡して在庫情報を更新
      // onDelete(stocks);

      if(showSnackbar){
        showSnackbar("success", `${name}を在庫一覧から削除しました。`)
      }

    } catch (error:any) {
      if(showSnackbar){
        showSnackbar("error", "削除できませんでした。" + error.message)
      }
    }
  };

  const handleUpdate = async (propsID: number) => {
    if (type === "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.08).toString();
    }
    if (type !== "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.1).toString();
    }

    try {
      await supabase.from("stocks").update({ price: newPrice }).eq("id", propsID);
      const { data: updatedStocks } = await supabase.from("stocks").select("*");
      onUpdate(updatedStocks);

      if(showSnackbar){
        showSnackbar("success", `${name}の価格を更新しました。`)
      }

    } catch (error:any) {
      if(showSnackbar){
        showSnackbar("error", "価格を更新できませんでした。" + error.message)
      }

    }
  };

  // 税抜き⇔税込みで表示金額を切り替える処理
  const calcPrice = () => {
    if (type === "食品" && tax === false) {
      let taxExcluded = Math.ceil(parseInt(price) / 1.08).toString();
      return taxExcluded;
    } else if (type !== "食品" && tax === false) {
      let taxExcluded = Math.ceil(parseInt(price) / 1.1).toString();
      return taxExcluded;
    } else {
      return price;
    }
  };

  return (
    <>
      <List
        key={id}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2">{name}</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {parseInt(price) !== 0 ? (
            <>
              <Typography variant="body1">{calcPrice()}円</Typography>
              <IconButton
                aria-label="use-item"
                color="primary"
                onClick={() => handleUse(id)}
              >
                <CheckCircleTwoTone />
              </IconButton>
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => handleDelete(id)}
              >
                <DeleteTwoTone />
              </IconButton>
            </>
          ) : (
            <>
              <TextField
                variant="standard"
                type="string"
                size="small"
                sx={{ m: 0, paddingBlock: 0, width: "7ch" }}
                value={newPrice}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewPrice(event.target.value);
                }}
              />
              <Typography variant="body1">円</Typography>
              <IconButton
                aria-label="update"
                color="success"
                onClick={() => handleUpdate(id)}
              >
                <ModeTwoTone />
              </IconButton>
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => handleDelete(id)}
              >
                <DeleteTwoTone />
              </IconButton>
            </>
          )}
        </Box>
      </List>
    </>
  );
};

export default Item;
