import { supabase } from "../../../utils/supabase";
import { useSnackbarContext } from "@/providers/context-provider";
import useStore, { useTaxStore } from "@/store";

import { CheckCircleTwoTone } from "@mui/icons-material";
import ControlPointTwoToneIcon from "@mui/icons-material/ControlPointTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";

import ToBuyButton from "@/app/components/ToBuyButton";
import { Stock } from "../../../utils/type";

type Props = {
id: number;
name: string;
price: number;
count: number;
type: string;
selectedDate: string | undefined | null;
to_buy: boolean;
setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const InStockItem = ({
  id,
  name,
  price,
  count,
  type,
  selectedDate,
  to_buy,
  setStocks,
}: Props) => {

  const { showSnackbar } = useSnackbarContext();
  const onUpdate = (data: any | undefined) => setStocks(data);
  const tax = useTaxStore((state) => state.tax);
  const user = useStore((state) => state.user);

  // UPDATE 使った日をuse_dateに記録する
  const handleUse = async (propsID: number, userId: string) => {
    if (selectedDate !== undefined) {
      try {
        // 使うボタン押下でuse_dateに記録してdailyに移動
        await supabase
          .from("stocks")
          .update({ use_date: selectedDate , to_buy: false})
          .eq("id", propsID);

        // 残数が1の在庫の使うボタンを押した場合、
        if (count === 1) {
          const { data: restocks } = await supabase
            .from("stocks")
            .select("*")
            .eq("id", propsID);
          // newStockへ一部をコピーする
          const newStock = {
            id: undefined,
            type: restocks![0].type,
            category: restocks![0].category,
            name: restocks![0].name,
            user_id: restocks![0].user_id,
            price: 0,
            reference_price: restocks![0].reference_price,
            registration_date: null,
            use_date: null,
          };

          // newStockを在庫に登録（使うボタンで選択した項目を複製して在庫リストに残す）
          await supabase.from("stocks").insert({ ...newStock });
        }

        // 在庫データを更新して、画面を更新
        const { data: updatedStocks } = await supabase
          .from("stocks")
          .select("*")
          .eq("user_id", userId);
        onUpdate(updatedStocks);
        if (showSnackbar) {
          showSnackbar("success", `『${name}』を${selectedDate}付けで計上しました。`);
        }
      } catch (error: any) {
        if (showSnackbar) {
          showSnackbar(
            "error",
            "使用日登録ができませんでした。" + error.message
          );
        }
      }
    } else {
      if (showSnackbar) {
        showSnackbar("error", "日付を選択してください。");
      }
    }
  };

  const handlePlus = async (propsID: number, userId: string) => {
    try {
      // 追加ボタンで選択した項目をnewStockへコピー
      const { data: restocks } = await supabase
        .from("stocks")
        .select()
        .eq("id", propsID);
      const newStock = {
        id: undefined,
        type: restocks![0].type,
        category: restocks![0].category,
        name: restocks![0].name,
        user_id: restocks![0].user_id,
        price: restocks![0].price,
        reference_price: restocks![0].price,
        registration_date: null,
        use_date: null,
      };

      // newStockを在庫に登録（追加ボタンで選択した項目を複製して在庫リストに追加する）
      await supabase.from("stocks").insert({ ...newStock });

      // 在庫データを更新して、画面を更新
      const { data } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", userId);
      onUpdate(data);
      if (showSnackbar) {
        showSnackbar("success", `『${name}』の在庫を1つ増やしました。`);
      }

        // 買い物リストから外す処理
        await supabase
        .from("stocks")
        .update({to_buy: false})
        .eq("id", propsID)
        // 在庫データを更新して、画面を更新
        const { data: data2 } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", userId);
        onUpdate(data2);

    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar(
          "error",
          `『${name}』を在庫に追加できません。` + error.message
        );
      }
    }
  };

  const handleMinus = async (propsID: number, userId: string) => {
    try {
      if (count === 1) {
        const { data: restocks } = await supabase
          .from("stocks")
          .select()
          .eq("id", propsID);
        const { error } = await supabase
          .from("stocks")
          .delete()
          .eq("id", propsID);
        const newStock = {
          id: undefined,
          type: restocks![0].type,
          category: restocks![0].category,
          name: restocks![0].name,
          reference_price : restocks![0].reference_price,
          user_id: restocks![0].user_id,
          price: 0,
          registration_date: null,
          use_date: null,
        };

        // newStockを在庫に登録（マイナスボタンで選択した項目を複製して在庫リストに追加する）
        await supabase.from("stocks").insert({ ...newStock });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("stocks")
          .delete()
          .eq("id", propsID);
        if (error) throw error;
      }
      const { data: updatedStocks } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", userId);
      onUpdate(updatedStocks);
      if (showSnackbar) {
        showSnackbar("success", `『${name}』の在庫を1つ減らしました。`);
      }
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar("error", "削除できませんでした。" + error.message);
      }
    }
  };

  // 税抜き⇔税込みで表示金額を切り替える処理
  const calcPrice = () => {
    if (type === "食品" && tax === false) {
      let taxExcluded = Math.ceil(price / 1.08)
      return taxExcluded;
    } else if (type !== "食品" && tax === false) {
      let taxExcluded = Math.ceil(price / 1.1)
      return taxExcluded;
    } else {
      return price;
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBlock: "8px",
          }}
        >
          <Typography variant="body2">{name}</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{ minWidth: "80px", textAlign: "end" }}
            >
              {calcPrice()}円
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginLeft: "4px", color: "grey", fontSize: "10px" }}
            >
              {tax === true ? "(込)" : "(抜)"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                minWidth: "50px",
                textAlign: "end",
                paddingRight: "8px",
              }}
            >
              x {count}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
          }}
        >
          <Tooltip title="使用済みにする" placement="top">
            <IconButton
              aria-label="use-item"
              color="success"
              onClick={() => handleUse(id, user.id)}
            >
              <CheckCircleTwoTone />
            </IconButton>
          </Tooltip>

          <Tooltip title="在庫を増やす" placement="top">
            <IconButton
              aria-label="plus1"
              color="primary"
              onClick={() => handlePlus(id, user.id)}
            >
              <ControlPointTwoToneIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="在庫を減らす" placement="top">
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => handleMinus(id, user.id)}
            >
              <RemoveCircleTwoToneIcon />
            </IconButton>
          </Tooltip>
          <ToBuyButton
            id={id}
            name={name}
            to_buy={to_buy}
            setStocks={setStocks}
          />
        </Box>
      </Box>
    </>
  );
};

export default InStockItem;
