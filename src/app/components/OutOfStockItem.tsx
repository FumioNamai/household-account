import { useState } from "react";
import { supabase } from "../../../utils/supabase";

import { DeleteTwoTone, ModeTwoTone } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbarContext } from "@/providers/context-provider";

import useStore, { useStockStore, useTaxStore } from "@/store";
import { CalcPrice } from "./CalcPrice";
import { GroupedData } from "../../../utils/type";
import ToBuyButton from "./ToBuyButton";

const OutOfStockItem = ({...groupedData}: GroupedData) => {
  const { showSnackbar } = useSnackbarContext();
  let [newPrice, setNewPrice] = useState<string>("");
  const tax = useTaxStore((state) => state.tax);
  const user = useStore((state) => state.user);
  let {setStocks} = useStockStore()
  const onUpdate = (data: any | undefined) => setStocks(data);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };
  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleNewPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPrice(event.target.value);
  };

  const handleDelete = async (propsID: number, userId: string) => {
    try {
      const { error } = await supabase
        .from("stocks")
        .delete()
        .eq("id", propsID);

      const { data: updatedStocks } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", userId);
      onUpdate(updatedStocks);

      if (error) throw error;
      // 親コンポーネントにstocksを渡して在庫情報を更新

      if (showSnackbar) {
        showSnackbar("success", `『${name}』を在庫一覧から削除しました。`);
      }
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar("error", "削除できませんでした。" + error.message);
      }
    }
  };

  // 価格の更新処理
  const handleUpdate = async (propsID: number, userId: string) => {
    // 価格入力に対してのバリデーション
    // 0以下の数字
    if (parseFloat(newPrice) <= 0) {
      if (showSnackbar) {
        showSnackbar("error", "価格を1円以上で入力してください。");
      }
      return;
    }
    // 整数でない場合
    if (Number.isInteger(parseFloat(newPrice)) === false) {
      if (showSnackbar) {
        showSnackbar("error", "価格を半角数字(整数)で入力してください。");
      }
      return;
    }

    // 税込・税別計算
    if(!tax){
      const taxRate = groupedData.type === "食品" ? 1.08 : 1.1
      newPrice = Math.floor(parseInt(newPrice) * taxRate).toString()
    }

    try {
      await supabase
        .from("stocks")
        .update({ price: newPrice, reference_price: newPrice })
        .eq("id", propsID);
      const { data: updatedStocks } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", userId);
      onUpdate(updatedStocks);
      if (showSnackbar) {
        showSnackbar("success", `『${name}』の価格を更新しました。`);
      }
      setNewPrice("");

      // 買い物リストから外す処理
      await supabase.from("stocks").update({ to_buy: false }).eq("id", propsID);
      // 在庫データを更新して、画面を更新
      const { data } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", userId);
      onUpdate(data);
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar("error", "価格を更新できませんでした。" + error.message);
      }
    }
  };

  return (
    <>
      {/* 在庫なし */}
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{ width: "100%" }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2">{groupedData.name}</Typography>
          <Stack direction="row" alignItems="center">
            <TextField
              variant="standard"
              type="string"
              size="small"
              inputProps={{ sx: { textAlign: "right", marginRight: "8px" } }}
              sx={{ m: 0, paddingBlock: 0, width: "7ch" }}
              placeholder={
                groupedData.reference_price ? `${CalcPrice(groupedData.reference_price, groupedData.type)}` : "0"
              }
              value={newPrice}
              onChange={handleNewPrice}
            />
            <Typography variant="body1">円</Typography>
            <Typography
              variant="body2"
              sx={{ marginLeft: "4px", color: "grey", fontSize: "10px" }}
            >
              {tax === true ? "(込)" : "(抜)"}
            </Typography>

            <Tooltip title="価格を更新する" placement="top">
              <IconButton
                aria-label="update"
                color="success"
                onClick={() => handleUpdate(groupedData.id, user.id)}
              >
                <ModeTwoTone />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="end">
          <Tooltip title="一覧から削除する" placement="top">
            <IconButton
              aria-label="delete"
              color="error"
              onClick={handleClickOpen}
            >
              <DeleteTwoTone />
            </IconButton>
          </Tooltip>
          <Dialog
            open={dialogOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {`『${groupedData.name}』を在庫一覧から削除しますか？`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>削除しない</Button>
              <Button onClick={() => handleDelete(groupedData.id, user.id)} color="error">
                削除する
              </Button>
            </DialogActions>
          </Dialog>
          <ToBuyButton {...groupedData} />
        </Stack>
      </Stack>
    </>
  );
};

export default OutOfStockItem;
