import { IconButton, Tooltip } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { supabase } from "../../../utils/supabase";
import { useSnackbarContext } from "@/providers/context-provider";
import useStore, { useSortableStore, useStockStore } from "@/store";
import { GroupedData } from "../../../utils/type";

const ToBuyButton = ({ ...groupedData }: GroupedData) => {
  const {isSortable, } = useSortableStore();
  const { showSnackbar } = useSnackbarContext();
  const user = useStore((state) => state.user);
  let {setStocks} = useStockStore()
  const onUpdate = (data: any | undefined) => setStocks(data);

  const handleToBuyListed = async (propsId: number, userId: string) => {
    if (groupedData.to_buy === false) {
      try {
        await supabase
          .from("stocks")
          .update({ to_buy: true , sort_id: null })
          .eq("id", propsId);
        const { data: updatedStocks } = await supabase
          .from("stocks")
          .select("*")
          .eq("user_id", userId);
        onUpdate(updatedStocks);
        if (showSnackbar) {
          showSnackbar("success", `『${groupedData.name}』を買い物リストに追加しました。`);
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
          .update({ to_buy: false, checked: false, sort_id: null })
          .eq("id", propsId);
          const { data: updatedStocks } = await supabase
          .from("stocks")
          .select("*")
          .eq("user_id", userId);
        onUpdate(updatedStocks);
        if (showSnackbar) {
          showSnackbar(
            "success",
            `『${groupedData.name}』を買い物リストから削除しました。`
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
      title={groupedData.to_buy === true ? "買い物リストから削除" : "買い物リストに追加"}
      placement="top"
    >
      <IconButton
        disabled=
        {isSortable}
        color={groupedData.to_buy === true ? "warning" : "default"}
        onClick={() => handleToBuyListed(groupedData.id, user.id)}
      >
        <ShoppingCartOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ToBuyButton;
