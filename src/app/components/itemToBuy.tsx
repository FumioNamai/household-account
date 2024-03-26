import { supabase } from "../../../utils/supabase";
import { Box, Checkbox, Divider, IconButton, List, Tooltip, Typography } from "@mui/material";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import useStore from "@/store";
import { useSnackbarContext } from "@/providers/context-provider";
import { Stock } from "../../../utils/type";

type Props = {
  id: number;
  name: string;
  to_buy: boolean;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const ItemToBuy = ({ id, name, to_buy, setStocks }: Props) => {
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
        const { data } = await supabase
          .from("stocks")
          .select("*")
          .eq("user_id", userId);
        onUpdate(data);
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
          .update({ to_buy: false })
          .eq("id", propsID);
        const { data } = await supabase
          .from("stocks")
          .select("*")
          .eq("user_id", userId);
        onUpdate(data);
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
    <>
    <List key={id}>
    {/* {to_buy === true && ( */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* コンポーネントとして分離する必要あり */}
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Checkbox />
            <Typography>{name}</Typography>
          </Box>
          <Tooltip title="買い物リストから削除">
            <IconButton
              color="warning"
              onClick={() => handleToBuyListed(id, user.id)}
            >
              <PlaylistAddCheckOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
    {/* )} */}
    </List>
    <Divider />
    </>
  );
};

export default ItemToBuy;
