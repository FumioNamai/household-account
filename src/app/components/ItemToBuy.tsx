import {
  Divider,
  List,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import CheckBox from "@/app/components/CheckBox";
import ModalToBuyList from "@/app/components/ModalToBuyList";
import ToBuyButton from "@/app/components/ToBuyButton";
import useStore, { useStockStore, useTaxStore } from "@/store";
import { useSnackbarContext } from "@/providers/context-provider";
import { supabase } from "../../../utils/supabase";
import { ShopList } from "./ShopList";
import { CalcPrice } from "./CalcPrice";
import { GroupedData } from "../../../utils/type";

const ItemToBuy = ({...groupedData}: GroupedData) => {
  const { showSnackbar } = useSnackbarContext();
  let { setStocks } = useStockStore();
  const onUpdate = (data: any | undefined) => setStocks(data);
  const tax = useTaxStore((state) => state.tax);
  const user = useStore((state) => state.user);

  const handleShopSelect = async (event: SelectChangeEvent) => {
    const shopName = event.target.value;

    try {
      // 店舗選択したら、shop_nameに記録
      await supabase
        .from("stocks")
        .update({ shop_name: shopName })
        .eq("id", groupedData.id);
      const { data: updatedStocks } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", user.id);
      onUpdate(updatedStocks);
      if (showSnackbar) {
        showSnackbar(
          "success",
          `${groupedData.name}を${shopName ? shopName : "購入店舗未定"}に移動しました。`
        );
      }
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar("error", "店舗登録ができませんでした。" + error.message);
      }
    }
  };

  return (
    <>
      <List key={groupedData.id}>
        <Stack direction="column">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <CheckBox id={groupedData.id} checked={groupedData.checked} />
              <ModalToBuyList {...groupedData} />
            </Stack>
            <Select
              variant="standard"
              size="small"
              value={groupedData.shop_name}
              onChange={handleShopSelect}
              sx={{ maxWidth: "50px", minWidth: "50px", padding: "0" }}
            >
              {ShopList.map((shop) => (
                <MenuItem key={shop.id} value={shop.shopName}>
                  {shop.shopName === "" ? "分類無し" : shop.shopName}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" alignItems="center">
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="baseline"
            >
              <Typography
                variant="body2"
                sx={{ minWidth: "80px", textAlign: "end", color: "grey" }}
              >
                {groupedData.reference_price
                  ? CalcPrice(groupedData.reference_price, groupedData.type)
                  : "0"}
                円
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginLeft: "4px", color: "grey", fontSize: "10px" }}
              >
                {tax === true ? "(込)" : "(抜)"}
              </Typography>
            </Stack>
            <ToBuyButton {...groupedData}/>
          </Stack>
        </Stack>
      </List>
      <Divider />
    </>
  );
};

export default ItemToBuy;
