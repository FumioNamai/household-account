import { supabase } from "../../../utils/supabase";
import { Box, Checkbox, Divider, IconButton, List, Tooltip, Typography } from "@mui/material";
// import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import useStore from "@/store";
import { useSnackbarContext } from "@/providers/context-provider";
import { Stock } from "../../../utils/type";
import { useState } from "react";
import { log } from "console";

type Props = {
  id: number;
  name: string;
  to_buy: boolean;
  checked: boolean;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const ItemToBuy = ({ id, name, to_buy,checked, setStocks }: Props) => {
  const { showSnackbar } = useSnackbarContext();
  const user = useStore((state) => state.user);
  const onUpdate = (data: any | undefined) => setStocks(data);

  // 購入済みとしてデータベースに記録する場合、useStateとイベントハンドラーを使う
  // const [checked, setChecked] = useState(false)
  // const handleCheck = (event:React.ChangeEvent<HTMLInputElement>) => {
  //   setChecked(event.target.checked)
  // }


  const handleCheck = async (propsID: number, userId: string)  => {
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
    };
  };

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
          .update({ to_buy: false ,checked: false})
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
            <Tooltip
            title={checked ? "チェックを外す" : "チェックを入れる"}>
            <Checkbox
            checked={checked ? true : false}
            onChange={() => handleCheck(id, user.id)}
            />
            </Tooltip>
            <Typography>{name}</Typography>
          </Box>
          <Tooltip title="買い物リストから削除">
            <IconButton
              color="warning"
              onClick={() => handleToBuyListed(id, user.id)}
            >
              <ShoppingCartOutlinedIcon />
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