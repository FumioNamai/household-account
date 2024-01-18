import { log } from "console";
import { supabase } from "../../../utils/supabase";
import { Button, IconButton } from "@mui/material";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";

const UsedItem = ({ props, onUpdate }) => {
  // 戻すボタン押下でuse_dataの値を取り除き、在庫に差し戻す処理
  const handleReturn = async (propsID: number) => {
    const date = null;
    try {
      const res = await supabase
        .from("stocks")
        .update({ use_date: date })
        .eq("id", propsID);
      const { data: stocks } = await supabase.from("stocks").select("*");
      onUpdate(stocks);
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
