import { supabase } from "../../../utils/supabase";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import { Stock } from "../../../utils/type";
import React from "react";
import { useSnackbarContext } from "@/providers/context-provider";
import useStore, { useTaxStore } from "@/store";

type Props = {
  id: number;
  name: string;
  price: number;
  stocks: Stock[] | null;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const UsedItem = ({ id, name, price, setStocks }: Props) => {
  const { showSnackbar } = useSnackbarContext();
  const user = useStore((state) => state.user);
  const onUpdate = (data: any | undefined) => setStocks(data);
  const tax = useTaxStore((state) => state.tax);

  // 戻すボタン押下でuse_dataの値を取り除き、在庫に差し戻す処理
  const handleReturn = async (propsID: number, userId: string) => {
    try {
      await supabase
        .from("stocks")
        .update({ use_date: null })
        .eq("id", propsID);
      const { data } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", userId);
      onUpdate(data);
      if (showSnackbar) {
        showSnackbar(
          "success",
          `『${name}』の使用を取り消し、在庫一覧に戻しました。`
        );
      }
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar("error", "在庫に戻せません。" + error.message);
      }
    }
  };

  return (
    <li key={id} className="flex flex-row items-center justify-between pl-4">
      <Typography variant="body2">{name}</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body1">{price}円</Typography>
        <Typography
          variant="body2"
          sx={{ marginLeft: "4px", color: "grey", fontSize: "10px" }}
        >
          {tax === true ? "(込)" : "(抜)"}
        </Typography>
        <Tooltip title={"在庫に戻す"} placement="top">
          <IconButton
            aria-label="return-item"
            color="warning"
            onClick={() => handleReturn(id, user.id)}
          >
            <UndoRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </li>
  );
};

export default UsedItem;
