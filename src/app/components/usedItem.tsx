import { log } from "console";
import { supabase } from "../../../utils/supabase";
import { Button, IconButton } from "@mui/material";
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
  use_date:  string | null;
}
}
type OnUpdateProps = { onUpdate: (stocks:Stock[] | null) => void }

const UsedItem:React.FC<Props & OnUpdateProps> = ({props,onUpdate}) => {
  // const UsedItem = ({ props , onUpdate}) => {

  // 戻すボタン押下でuse_dataの値を取り除き、在庫に差し戻す処理
  const handleReturn = async (propsID: number) => {
    // const date = null;
    try {
      await supabase
        .from("stocks")
        .update({ use_date: null })
        .eq("id", propsID);
      const { data: stocks } = await supabase.from("stocks").select("*");
      onUpdate( stocks );
      alert(`${props.name}の使用を取り消し、在庫一覧に戻しました。`)
    } catch (error) {
      alert("在庫に戻せません" + error.message);
    }
  };

  return (
    <li
      key={props.id}
      className="flex flex-row gap-1 items-center justify-between p-1 min-w-60"
    >
      <p className="text-xs min-w-24">{props.name}</p>
      <div className="flex items-center ">
      <p className=" text-xs">{props.price}円</p>
      {/* <Button variant="outlined" onClick={() => handleReturn(props.id)}>
        戻
      </Button> */}
      <IconButton aria-label="return-item" onClick={() => handleReturn(props.id)}>
        <UndoRoundedIcon />
      </IconButton>
      </div>
    </li>
  );
};

export default UsedItem;
