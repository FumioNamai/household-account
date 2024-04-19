import { Checkbox, Tooltip } from "@mui/material";
import { supabase } from "../../../utils/supabase";
import { Stock } from "../../../utils/type";
import { useSnackbarContext } from "@/providers/context-provider";
import useStore from "@/store";

type Props = {
  id: number;
  name: string;
  checked: boolean;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const CheckBox = ({ id, checked, setStocks }: Props) => {
  const { showSnackbar } = useSnackbarContext();
  const user = useStore((state) => state.user);
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
          showSnackbar("error", "できませんでした。" + error.message);
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
          showSnackbar("error", "できませんでした。" + error.message);
        }
      }
    }
  };

  return (
    <Tooltip title={checked ? "チェックを外す" : "チェックを入れる"}>
      <Checkbox
        checked={checked ? true : false}
        onChange={() => handleCheck(id, user.id)}
      />
    </Tooltip>
  );
};

export default CheckBox;
