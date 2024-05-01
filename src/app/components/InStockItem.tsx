import { supabase } from "../../../utils/supabase";
import { useSnackbarContext } from "@/providers/context-provider";
import useStore, { useDateStore, useStockStore, useTaxStore } from "@/store";

import { CheckCircleTwoTone } from "@mui/icons-material";
import ControlPointTwoToneIcon from "@mui/icons-material/ControlPointTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";

import ToBuyButton from "@/app/components/ToBuyButton";
import { CalcPrice } from "./CalcPrice";
import { GroupedData } from "../../../utils/type";

const InStockItem = ({ ...groupedData }: GroupedData ) => {

  const { showSnackbar } = useSnackbarContext();
  let {setStocks} = useStockStore()
  const onUpdate = (data: any | undefined) => setStocks(data);
  const tax = useTaxStore((state) => state.tax);
  const user = useStore((state) => state.user);
  const {selectedDate} = useDateStore()

  // UPDATE 使った日をuse_dateに記録する
  const handleUse = async (propsID: number, userId: string) => {

    if (selectedDate() !== undefined) {
      try {
        // 使うボタン押下でuse_dateに記録してdailyに移動
        await supabase
          .from("stocks")
          .update({ use_date: selectedDate() , to_buy: false})
          .eq("id", propsID);

        // 残数が1の在庫の使うボタンを押した場合、
        if (groupedData.count === 1) {
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
          showSnackbar("success", `『${name}』を${selectedDate()}付けで計上しました。`);
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
        showSnackbar("success", `『${groupedData.name}』の在庫を1つ増やしました。`);
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
          `『${groupedData.name}』を在庫に追加できません。` + error.message
        );
      }
    }
  };

  const handleMinus = async (propsID: number, userId: string) => {
    try {
      if (groupedData.count === 1) {
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
        showSnackbar("success", `『${groupedData.name}』の在庫を1つ減らしました。`);
      }
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar("error", "削除できませんでした。" + error.message);
      }
    }
  };

  return (
    <>
      <Stack direction="column" sx={{ width: "100%" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center"
          sx={{
            paddingBlock: "8px",
          }}
        >
          <Typography variant="body2">{groupedData.name}</Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              variant="body1"
              sx={{ minWidth: "80px", textAlign: "end" }}
            >
              { groupedData.price ? CalcPrice(groupedData.price,groupedData.type): "0"}円

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
              x {groupedData.count}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" justifyContent="right">
          <Tooltip title="使用済みにする" placement="top">
            <IconButton
              aria-label="use-item"
              color="success"
              onClick={() => handleUse(groupedData.id, user.id)}
            >
              <CheckCircleTwoTone />
            </IconButton>
          </Tooltip>

          <Tooltip title="在庫を増やす" placement="top">
            <IconButton
              aria-label="plus1"
              color="primary"
              onClick={() => handlePlus(groupedData.id, user.id)}
            >
              <ControlPointTwoToneIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="在庫を減らす" placement="top">
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => handleMinus(groupedData.id, user.id)}
            >
              <RemoveCircleTwoToneIcon />
            </IconButton>
          </Tooltip>
          <ToBuyButton {...groupedData} />
        </Stack>
      </Stack>
    </>
  );
};

export default InStockItem;
