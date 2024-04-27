import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Stock } from "../../../utils/type";
import { useState } from "react";
import { useStore, useTaxStore } from "@/store";
import TaxSwitch from "./TaxSwitch";
import { useSnackbarContext } from "@/providers/context-provider";
import { supabase } from "../../../utils/supabase";
import { CalcPrice } from "./CalcPrice";

type Props = {
  id: number;
  name: string;
  price: number;
  reference_price: number | null;
  count: number;
  type: string;
  category: string;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  selectedDate: string | undefined | null;
};

const ModalToBuyList = ({
  id,
  name,
  price,
  reference_price,
  count,
  type,
  category,
  selectedDate,
  setStocks,
}: Props) => {
  const { showSnackbar } = useSnackbarContext();
  const user = useStore((state) => state.user);
  const tax = useTaxStore((state) => state.tax);

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const onUpdate = (data: any | undefined) => setStocks(data);

  let [newPrice, setNewPrice] = useState<string>("");
  const handleNewPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPrice(event.target.value);
  };
  const [amount, setAmount] = useState<string>("1");
  const amounts: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const handleAmountChange = (event: SelectChangeEvent) => {
    setAmount(event.target.value);
  };



  const handleForm = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (parseFloat(newPrice) <= 0) {
      if (showSnackbar) {
        showSnackbar("error", "価格を1円以上で入力してください。");
      }
      return;
    }
    if (Number.isInteger(parseFloat(newPrice)) === false) {
      if (showSnackbar) {
        showSnackbar("error", "価格を半角数字(整数)で入力してください。");
      }
      return;
    }

    if (type === "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.08).toString();
    }
    if (type !== "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.1).toString();
    }

    try {
      for (let i = 0; i < parseInt(amount); i++) {
        const { error } = await supabase.from("stocks").insert({
          type: type,
          name: name,
          price: newPrice,
          reference_price: newPrice,
          registration_date: selectedDate,
          category: category,
          user_id: user.id,
        });
        if (error) throw error;
      }
      await supabase.from("stocks").update({ to_buy: false }).eq("id", id);
      const { data } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", user.id);

      onUpdate(data);
      if (showSnackbar) {
        showSnackbar(
          "success",
          `『${name}』を${amount}個、在庫として登録しました。`
        );
      }
    } catch (error) {
      if (showSnackbar) {
        showSnackbar("error", "データの更新ができません。");
      }
    }
  };

  return (
    <>
      <Box>
        <Button onClick={handleModalOpen} sx={{ textTransform: "none", minWidth:"0"}}>{name}</Button>
      </Box>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
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
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: "16px",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center"
            sx={{
              marginBottom: "20px",
            }}
          >
            <Typography variant="h5">
              在庫登録
            </Typography>
            <TaxSwitch />
          </Stack>
          <Typography variant="body2">現在の在庫</Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">種別:{type}</Typography>
            <Typography variant="body2">分類:{category}</Typography>
            <Stack direction="row" alignItems="center"
              sx={{
                paddingBlock: "8px",
              }}
            >
              <Typography variant="body2">価格:</Typography>
              <Typography
                variant="body2"
                sx={{ width: "80px", textAlign: "end" }}
              >
                { CalcPrice(price,type)}円
                <span className="text-gray-500 text-[10px] ml-0.5">
                  {tax === true ? "(込)" : "(抜)"}
                </span>
              </Typography>
              <Typography
                variant="body2"
                sx={{ width: "32px", textAlign: "end" }}
              >
                x{ CalcPrice(price,type) ? count : 0}
              </Typography>
            </Stack>
          </Stack>
          <form onSubmit={handleForm}>
          <Stack direction="row" justifyContent="space-between" alignItems="center"
              sx={{
                paddingBlock: "8px",
              }}
            >
              <Typography variant="body1">{name}</Typography>

              <Stack direction="row" alignItems="center">
                <TextField
                  variant="standard"
                  type="string"
                  size="small"
                  placeholder = {reference_price ? `${CalcPrice(reference_price,type)  } ` : "0" }
                  inputProps={{
                    sx: { textAlign: "right", marginRight: "8px" },
                  }}
                  sx={{ paddingBlock: "3px 0", width: "7ch", height: "32px" }}
                  value={newPrice}
                  onChange={handleNewPrice}
                />
                <Typography variant="body1">円</Typography>
                <Typography
                  variant="body2"
                  sx={{ marginLeft: "2px", color: "grey", fontSize: "10px" }}
                >
                  {tax === true ? "(込)" : "(抜)"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ marginLeft: "10px", color: "grey", fontSize: "16px" }}
                >
                  ×
                </Typography>
                <FormControl>
                  <Select
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    sx={{ width: "50px", textAlign: "right" }}
                    variant="standard"
                  >
                    {amounts.map((amount) => (
                      <MenuItem
                        key={amount}
                        value={amount}
                        sx={{ justifyContent: "center" }}
                      >
                        {amount}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>

            <div className="flex flex-row justify-between mt-5">
              <Button
                onClick={handleModalClose}
                size="small"
                color="error"
                variant="outlined"
              >
                閉じる
              </Button>
              <Button
                size="small"
                variant="outlined"
                type="submit"
              >
                在庫に追加する
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ModalToBuyList;
