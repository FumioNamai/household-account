import {
  Divider,
  List,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { Stock } from "../../../utils/type";
import CheckBox from "@/app/components/CheckBox";
import ModalToBuyList from "@/app/components/ModalToBuyList";
import ToBuyButton from "@/app/components/ToBuyButton";
import useStore, { useTaxStore } from "@/store";
import { useSnackbarContext } from "@/providers/context-provider";
import { supabase } from "../../../utils/supabase";
import { ShopList } from "./ShopList";

type Props = {
  id: number;
  name: string;
  price: number;
  reference_price: number | null;
  count: number;
  type: string;
  category: string;
  selectedDate: string | undefined | null;
  to_buy: boolean;
  checked: boolean;
  shop_name: string;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const ItemToBuy = ({
  id,
  name,
  price,
  reference_price,
  count,
  type,
  category,
  selectedDate,
  to_buy,
  checked,
  shop_name,
  setStocks,
}: Props) => {
  const { showSnackbar } = useSnackbarContext();
  const onUpdate = (data: any | undefined) => setStocks(data);
  const tax = useTaxStore((state) => state.tax);
  const user = useStore((state) => state.user);

  // 税抜き⇔税込みで表示金額を切り替える処理
  const calcPrice = () => {
    if (type === "食品" && tax === false) {
      let taxExcluded = Math.ceil(reference_price! / 1.08);
      return taxExcluded;
    } else if (type !== "食品" && tax === false) {
      let taxExcluded = Math.ceil(reference_price! / 1.1);
      return taxExcluded;
    } else {
      return reference_price;
    }
  };

  const handleShopSelect = async (event: SelectChangeEvent) => {
    const shopName = event.target.value;

    try {
      // 店舗選択したら、shop_nameに記録
      await supabase
        .from("stocks")
        .update({ shop_name: shopName })
        .eq("id", id);
      const { data: updatedStocks } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", user.id);
      onUpdate(updatedStocks);
      if (showSnackbar) {
        showSnackbar("success", `${name}を${shopName}に移動しました。`);
      }
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar("error", "店舗登録ができませんでした。" + error.message);
      }
    }
  };

  return (
    <>
      <List key={id}>
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
              <CheckBox
                id={id}
                name={name}
                checked={checked}
                setStocks={setStocks}
              />
              <ModalToBuyList
                id={id}
                name={name}
                price={price}
                reference_price={reference_price}
                count={count}
                type={type}
                category={category}
                selectedDate={selectedDate}
                setStocks={setStocks}
              />
            </Stack>
            <Select
              variant="standard"
              size="small"
              value={shop_name}
              onChange={handleShopSelect}
              sx={{ maxWidth: "50px", minWidth: "50px", padding: "0" }}
            >
              {ShopList.map((shop) => (
                <MenuItem key={shop.id} value={shop.shopName}>
                  {shop.shopName}
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
                {calcPrice()}円
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginLeft: "4px", color: "grey", fontSize: "10px" }}
              >
                {tax === true ? "(込)" : "(抜)"}
              </Typography>
            </Stack>
            <ToBuyButton
              id={id}
              name={name}
              to_buy={to_buy}
              setStocks={setStocks}
            />
          </Stack>
        </Stack>
      </List>
      <Divider />
    </>
  );
};

export default ItemToBuy;
