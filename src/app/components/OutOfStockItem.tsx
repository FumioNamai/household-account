import { useState } from "react";
import { supabase } from "../../../utils/supabase";

import { DeleteTwoTone, ModeTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import ToBuyButton from "./ToBuyButton";

import useStore, { useTaxStore } from "@/store";
import { Stock } from "../../../utils/type";
import { useSnackbarContext } from "@/providers/context-provider";

type Props = {
  id: number;
  name: string;
  type: string;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  to_buy: boolean;
  open: boolean | undefined;
};

const OutOfStockItem = ({ id, name, type, to_buy, setStocks, open }: Props) => {
  const { showSnackbar } = useSnackbarContext();
  let [newPrice, setNewPrice] = useState<string>("");
  const tax = useTaxStore((state) => state.tax);
  const user = useStore((state) => state.user);
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

    // 税込・税抜金額切り替え
    if (type === "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.08).toString();
    }
    if (type !== "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.1).toString();
    }

    try {
      await supabase
        .from("stocks")
        .update({ price: newPrice })
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
      // モーダルからの操作の場合、1秒遅らせて
      if (open) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
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
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">{name}</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextField
              variant="standard"
              type="string"
              size="small"
              sx={{ m: 0, paddingBlock: 0, width: "7ch" }}
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
                onClick={() => handleUpdate(id, user.id)}
              >
                <ModeTwoTone />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
          }}
        >
          <Tooltip title="一覧から削除する" placement="bottom">
            <IconButton
              aria-label="delete"
              color="error"
              // onClick={() => handleDelete(id, user.id)}
              disabled={open ? true : false}
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
                {`『${name}』を在庫一覧から削除しますか？`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>削除しない</Button>
              <Button onClick={() => handleDelete(id, user.id)} color="error">
                削除する
              </Button>
            </DialogActions>
          </Dialog>
          <ToBuyButton
            id={id}
            name={name}
            to_buy={to_buy}
            setStocks={setStocks}
          />
        </Box>
      </Box>
    </>
  );
};

export default OutOfStockItem;
