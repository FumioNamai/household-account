import { log } from "console";
import { supabase } from "../../../utils/supabase";
import { Box, Button, IconButton, Typography } from "@mui/material";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import { Stock } from "../../../utils/interface";
import React from "react";

type Props = {
  props: {
    id: number;
    type: string;
    name: string;
    price: number;
    category: string;
    registration_date: string | null;
    use_date: string | null;
  };
};
export type OnUpdateProps = { onUpdate: (stocks: Stock[] | null) => void };

const UsedItem: React.FC<Props & OnUpdateProps> = ({
  id,
  name,
  price,
  stocks,
  setStocks,
}) => {
  const onUpdate = (stocks: Stock[]) => setStocks(stocks);
  // 戻すボタン押下でuse_dataの値を取り除き、在庫に差し戻す処理
  const handleReturn = async (propsID: number) => {
    try {
      await supabase
        .from("stocks")
        .update({ use_date: null })
        .eq("id", propsID);
      const { data: stocks } = await supabase.from("stocks").select("*");
      onUpdate(stocks);
      alert(`${name}の使用を取り消し、在庫一覧に戻しました。`);
    } catch (error) {
      alert("在庫に戻せません" + error.message);
    }
  };

  return (
    <li
      key={id}
      className="flex flex-row gap-1 items-center justify-between p-1"
    >
      <Typography variant="body2">{name}</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body1">{price}円</Typography>
        <IconButton
          aria-label="return-item"
          color="warning"
          onClick={() => handleReturn(id)}
        >
          <UndoRoundedIcon />
        </IconButton>
      </Box>
    </li>
  );
};

export default UsedItem;
