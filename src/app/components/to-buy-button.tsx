import { IconButton, Tooltip } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { supabase } from "../../../utils/supabase";
import { useSnackbarContext } from "@/providers/context-provider";
import useStore from "@/store";
import { Stock } from "../../../utils/type";

type Props = {
  id: number;
  name: string;
  to_buy: boolean;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const ToBuyButton = ({ id, name, to_buy, setStocks }: Props) => {
  const { showSnackbar } = useSnackbarContext();
  const user = useStore((state) => state.user);

  const onUpdate = (data: any | undefined) => setStocks(data);

  const handleToBuyListed = async (propsID: number, userId: string) => {
    if (to_buy === false) {
      try {
        await supabase
          .from("stocks")
          .update({ to_buy: true })
          .eq("id", propsID);
        const { data: updatedStocks } = await supabase
          .from("stocks")
          .select("*")
          .eq("user_id", userId);
        onUpdate(updatedStocks);
        if (showSnackbar) {
          showSnackbar("success", `『${name}』を買い物リストに追加しました。`);
        }
      } catch (error: any) {
        if (showSnackbar) {
          showSnackbar(
            "error",
            "買い物リストに追加できませんでした。" + error.message
          );
        }
      }
    } else {
      try {
        await supabase
          .from("stocks")
          .update({ to_buy: false, checked: false })
          .eq("id", propsID);
        const { data: updatedStocks } = await supabase
          .from("stocks")
          .select("*")
          .eq("user_id", userId);
        onUpdate(updatedStocks);
        if (showSnackbar) {
          showSnackbar(
            "success",
            `『${name}』を買い物リストから削除しました。`
          );
        }
      } catch (error: any) {
        if (showSnackbar) {
          showSnackbar(
            "error",
            "買い物リストから削除できませんでした。" + error.message
          );
        }
      }
    }
  };

  return (
    <Tooltip
      title={to_buy === true ? "買い物リストから削除" : "買い物リストに追加"}
      placement="bottom"
    >
      <IconButton
        color={to_buy === true ? "warning" : "default"}
        onClick={() => handleToBuyListed(id, user.id)}
      >
        <ShoppingCartOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ToBuyButton;
