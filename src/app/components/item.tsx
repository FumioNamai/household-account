import { useState } from "react";
import { Stock } from "../../../utils/interface";
import { supabase } from "../../../utils/supabase";
import { log } from "console";
import { Box, Button, IconButton, InputAdornment, List, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlined from '@mui/icons-material/EditOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { AlarmTwoTone } from "@mui/icons-material";

const Item = ({ props, onUpdate, onDelete, date, tax }) => {
  let [price, setPrice] = useState<string>("");

  // UPDATE 使った日をuse_dateに記録する
  const handleUse = async (propsID: number) => {

    if (date !== undefined) {
      try {
        // 使うボタンで選択した項目をnewStockへコピー
        const { data: restocks, error } = await supabase
          .from("stocks")
          .select()
          .eq("id", propsID);
        const newStock = {
          id: undefined,
          type: restocks![0].type,
          category: restocks![0].category,
          name: restocks![0].name,
          price: 0,
          registration_date: null,
          use_date: null,
        };

        // 使うボタン押下でuse_dateに記録してdailyに移動
        const { data: stocks } = await supabase
          .from("stocks")
          .update({ use_date: date })
          .eq("id", propsID);

        // newStockを在庫に登録（使うボタンで選択した項目を複製して在庫リストに残す）
        await supabase.from("stocks").insert({ ...newStock });

        // 在庫データを更新して、画面を更新
        const { data: updatedStocks } = await supabase.from("stocks").select("*");
        onUpdate(updatedStocks);
        alert(`${props.name}を${date}付けで計上しました。`)
      } catch (error) {
        alert("使用日登録ができませんでした。" + error.message);
      }
    } else {
      alert("日付を選択してください。")
    }
  };

  const handleDelete = async (propsID: number) => {
    try {
      const { error } = await supabase
        .from("stocks")
        .delete()
        .eq("id", propsID);
      const { data: stocks } = await supabase.from("stocks").select("*");
      // 親コンポーネントにstocksを渡して在庫情報を更新
      onDelete(stocks);
      alert(`${props.name}を在庫一覧から削除しました。`)
    } catch (error) {
      alert("削除できませんでした" + error.message);
    }
  };

  const handleUpdate = async (propsID: number) => {
      if (props.type === "食品" && tax === false) {
        price = Math.floor(parseInt(price) * 1.08).toString();
      }
      if (props.type !== "食品" && tax === false) {
        price = Math.floor(parseInt(price) * 1.1).toString();
      }
    try {
      await supabase.from("stocks").update( {price} ).eq("id", propsID);
      const { data: updateStocks } = await supabase.from("stocks").select("*");
      onUpdate(updateStocks);
      alert(`${props.name}の価格を更新しました。`)
    } catch (error) {
      alert("価格を更新できませんでした" + error.message);
    }
  };

  // 税抜き⇔税込みで表示金額を切り替える処理
  const calcPrice = () => {
    if (props.type === "食品" && tax === false ) {
      let taxExcluded = Math.ceil(parseInt(props.price) / 1.08 ).toString()
      return taxExcluded
    } else if (props.type !== "食品" && tax === false ) {
      let taxExcluded = Math.ceil(parseInt(props.price) / 1.1).toString()
        return taxExcluded
    } else {
      return props.price
    }
    }

  return (
    <>
      <List
        key={props.id}
        sx={{ display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}
        // className="flex flex-row items-center justify-between p-1"
      >
        <Typography variant="body2">{props.name}</Typography>
        <Box sx={{display:"flex", alignItems:"center"}}>
          {props.price !== 0 ? (
            <>
              <Typography variant="body1">{calcPrice()}円</Typography>

              <IconButton
                aria-label="use-item"
                color="primary"
                onClick={() => handleUse(props.id)} >
                <CheckCircleOutlinedIcon  />
              </IconButton>

              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => handleDelete(props.id)} >
                <DeleteIcon />
              </IconButton>
            </>
          ) : (
            <>
              <TextField
              variant="standard"
              type="number"
              size="small"
              sx={{ m: 0, paddingBlock: 0, width: "7ch" }}
                value={price}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPrice(event.target.value);}}
              />
              <Typography variant="body1">円
              </Typography>
              <IconButton
                aria-label="update"
                color="success"
                onClick={() => handleUpdate(props.id)} >
                <EditOutlined />
              </IconButton>
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => handleDelete(props.id)} >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      </List>
    </>
  );
};

export default Item;
