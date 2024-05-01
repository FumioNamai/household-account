import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Types } from "./types";
import useStore, { useStockStore } from "@/store";
import { useSnackbarContext } from "@/providers/context-provider";
import { Categories } from "./Categories";
import { supabase } from "../../../utils/supabase";
import { GroupedData } from "../../../utils/type";
import { ShopList } from "./ShopList";

type Props = { groupedDataArr: GroupedData[] };

export default function ModalToBuyRegistration({
  groupedDataArr,
}: Props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const user = useStore((state) => state.user);
  let {setStocks} = useStockStore()
  const onUpdate = (data: any | undefined) => setStocks(data);

  const { showSnackbar } = useSnackbarContext();

  const [type, setType] = useState<string>("食品");

  const [itemName, setItemName] = useState<string>("");
  const [shopName, setShopName] = useState<string>("");

  let [newPrice, setNewPrice] = useState<string>("");
  const [categoryItem, setCategoryItem] = useState("");
  const [, setIsFocus] = useState(false);


  const handleSelectCategory = (event: SelectChangeEvent) => {
    setCategoryItem(event.target.value as string);
  };

  const handleItemNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(event.target.value);
  };

  const handleShopSelect = (event: SelectChangeEvent) => {
    setShopName(event.target.value);
  };

  const handleForm = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!type) {
      if (showSnackbar) {
        showSnackbar("error", "種別を選択してください。");
      }
      return;
    }

    if (type === "食品" && categoryItem === "") {
      if (showSnackbar) {
        showSnackbar("error", "食品の分類を選択してください。");
      }
      return;
    }

    if (itemName.length === 0) {
      if (showSnackbar) {
        showSnackbar("error", "商品名を入力してください。");
      }
      return;
    }

    // 入力された商品名と価格を検索して、登録済みの場合は処理を中断させる
    const isStocked = groupedDataArr.some(
      (data: any) => data.name === itemName
      // && data.price === parseInt(newPrice ? newPrice : "0")
    );
    if (isStocked) {
      if (showSnackbar) {
        showSnackbar(
          "error",
          "同じ名前の商品が在庫一覧に登録されています。在庫一覧から買い物リストへ登録してください。"
        );
      }
      return;
    }

    try {
      // 買い物リストに登録する処理 (amount === 0)
      const { error } = await supabase.from("stocks").insert({
        type: type,
        name: itemName,
        price: 0,
        reference_price: 0,
        category: categoryItem,
        user_id: user.id,
        to_buy: true,
        shop_name: shopName,
      });
      if (error) throw error;
      const { data } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", user.id);

      onUpdate(data);
      setItemName("");
      setNewPrice("");
      setCategoryItem("");
      if (showSnackbar) {
        showSnackbar(
          "success",
          `『${itemName}』を買い物リストに追加しました。`
        );
      }
    } catch (error) {
      if (showSnackbar) {
        showSnackbar("error", "買い物リストに追加できませんでした。");
      }
    }
  };

  return (
    <>
      <Box>
        <Button variant="outlined" size="large" onClick={handleOpen}>
          登録
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ maxWidth: "sm", mx: "auto" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxHeight: "90%",
            overflow: "scroll",
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: "16px",
          }}
        >
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="h5" sx={{ marginBottom: "20px" }}>
              買い物リスト登録
            </Typography>
            <Box sx={{ paddingInline: "0px" }}>
              <form onSubmit={handleForm}>
                <InputLabel id="type">種別</InputLabel>

                <ToggleButtonGroup
                  // size="small"
                  color="primary"
                  value={type}
                  exclusive
                  onChange={(event, newType) => setType(newType)}
                  sx={{ marginBottom: "12px" }}
                >
                  {Types.map((type) => (
                    <ToggleButton
                      key={type}
                      value={type}
                      sx={{ width: "80px" }}
                    >
                      {type}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>

                <FormControl
                  disabled={type !== "食品"}
                  sx={{ display: "flex", marginBottom: "12px" }}
                >
                  <InputLabel>食品の分類</InputLabel>
                  <Select
                    id="category"
                    sx={{ width: "238px" }}
                    value={categoryItem}
                    label="食品の分類"
                    onChange={handleSelectCategory}
                  >
                    <MenuItem value={""}></MenuItem>
                    {Categories.map(
                      (category) =>
                        category !== "すべて" && (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        )
                    )}
                  </Select>
                </FormControl>

                <FormControl sx={{ marginBottom: "12px" }}>
                  <TextField
                    onFocus={() => setIsFocus(true)}
                    label="商品名"
                    variant="outlined"
                    type="text"
                    id="name"
                    value={itemName}
                    onChange={handleItemNameChange}
                    sx={{ width: "238px", padding: "0" }}
                  />
                </FormControl>

                <FormControl sx={{ display: "flex", marginBottom: "12px" }}>
                  <InputLabel>購入予定店</InputLabel>
                  <Select
                    label="購入予定店"
                    variant="outlined"
                    size="medium"
                    value={shopName}
                    onChange={handleShopSelect}
                    sx={{ width: "238px", padding: "0" }}
                  >
                    {ShopList.map((shop) => (
                      <MenuItem key={shop.id} value={shop.shopName}>
                        {shop.shopName === "" ? "分類無し" : shop.shopName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Stack direction="column">
                  <Box>
                    <Button variant="outlined" type="submit">
                      買い物リストに追加する
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Box>
          </Box>

          <Button
            onClick={handleClose}
            size="small"
            color="error"
            variant="outlined"
            sx={{ marginTop: "30px" }}
          >
            閉じる
          </Button>
        </Box>
      </Modal>
    </>
  );
}
