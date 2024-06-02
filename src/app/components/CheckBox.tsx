import { Checkbox, Tooltip } from "@mui/material";
import { supabase } from "../../../utils/supabase";
import { useSnackbarContext } from "@/providers/context-provider";
import useStore, { useSortableStore, useStockStore } from "@/store";

type Props = {
  id: number;
  checked: boolean;
};

const CheckBox = ({ id, checked }: Props) => {
  const { showSnackbar } = useSnackbarContext();
  const user = useStore((state) => state.user);
  const {isSortable, } = useSortableStore();
  let {setStocks} = useStockStore()
  const onUpdate = (data: any | undefined) => setStocks(data);

  const handleCheck = async (propsID: number, userId: string) => {
    if (checked === false) {
      try {
        await supabase
          .from("stocks")
          .update({ checked: true })
          .eq("id", propsID);
        const { data: updatedStocks } = await supabase
          .from("stocks")
          .select("*")
          .eq("user_id", userId);
        onUpdate(updatedStocks);
      } catch (error: any) {
        if (showSnackbar) {
          showSnackbar("error", "チェックを記録することができませんでした。" + error.message);
        }
      }
    } else {
      try {
        await supabase
          .from("stocks")
          .update({ checked: false })
          .eq("id", propsID);
        const { data: updatedStocks } = await supabase
          .from("stocks")
          .select("*")
          .eq("user_id", userId);
        onUpdate(updatedStocks);
      } catch (error: any) {
        if (showSnackbar) {
          showSnackbar("error", "チェックの記録を変更できませんでした。" + error.message);
        }
      }
    }
  };

  return (
    <Tooltip title={checked ? "チェックを外す" : "チェックを入れる"} placement="top">
      <Checkbox
        disabled={isSortable}
        checked={checked ? true : false}
        onChange={() => handleCheck(id, user.id)}
      />
    </Tooltip>
  );
};

export default CheckBox;
