import { useState } from "react";
import { Stock } from "../../../utils/interface";
import { supabase } from "../../../utils/supabase";
import { log } from "console";
import { Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlined from '@mui/icons-material/EditOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const Item = ({ props, onUpdate, onDelete, date }) => {
  const [price, setPrice] = useState<string>("");
  // UPDATE 使った日をuse_dateに記録する
  const handleUse = async (propsID: number) => {
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
    } catch (error) {
      alert("使用日登録ができませんでした" + error.message);
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
    } catch (error) {
      alert("削除できませんでした" + error.message);
    }
  };

  const handleUpdate = async (propsID: number) => {
    try {
      await supabase.from("stocks").update({ price: price }).eq("id", propsID);
      const { data: updateStocks } = await supabase.from("stocks").select("*");
      onUpdate(updateStocks);
    } catch (error) {
      alert("価格を更新できませんでした" + error.message);
    }
  };
  return (
    <>
      <li
        key={props.id}
        className="flex flex-row items-center justify-between p-1 min-w-60"
      >
        <p className="text-xs max-w-24">{props.name}</p>
        <div className="flex items-center ">
          {props.price !== 0 ? (
            <>
              {/* <form onSubmit={handleForm} > */}
              <p className="text-xs">{props.price}円</p>
              {/* </form> */}
              {/* <Button
                variant="outlined"
                size="small"
                onClick={() => handleUse(props.id)}
              >
                使
              </Button> */}
              <IconButton aria-label="use-item" onClick={() => handleUse(props.id)} >
                <CheckCircleOutlinedIcon  />
              </IconButton>
              {/* <Button
                variant="outlined"
                size="small"
                onClick={() => handleDelete(props.id)}
              >
                消
              </Button> */}

              <IconButton aria-label="delete" onClick={() => handleDelete(props.id)} >
                <DeleteIcon />
              </IconButton>
            </>
          ) : (
            <>
              {/* <form onSubmit={handleForm}> */}
              {/* <label className="text-xs">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  // onChange={}
                  className=" text-xs mr-1 w-10 text-end rounded focus:outline-sky-500 cursor-pointer"
                  onChange={(e) => setPrice(e.target.value)}
                />
                円
              </label> */}

              <TextField
              variant="standard"
              type="number"
              size="small"
              sx={{ m: 0, paddingBlock: 0, width: "8ch" }}
                value={price}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPrice(event.target.value);}}
              />
              <Typography variant="body1" sx={{fontSize:12}}>円
              </Typography>
              {/* </form> */}
              {/* <Button
                variant="outlined"
                size="small"
                onClick={() => handleUpdate(props.id)}
              >
                更
              </Button> */}
              <IconButton aria-label="update" onClick={() => handleUpdate(props.id)} >
                <EditOutlined />
              </IconButton>
              <IconButton aria-label="delete" onClick={() => handleDelete(props.id)} >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </div>
      </li>
    </>
  );
};

export default Item;
