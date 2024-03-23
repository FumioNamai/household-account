import React, { useState } from "react";
import { Stock } from "../../../utils/type";
import { supabase } from "../../../utils/supabase";
import {
  Box,
  Divider,
  IconButton,
  List,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbarContext } from "@/providers/context-provider";
import {
  CheckCircleTwoTone,
  DeleteTwoTone,
  ModeTwoTone,
} from "@mui/icons-material";
import ControlPointTwoToneIcon from "@mui/icons-material/ControlPointTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import useStore, { useTaxStore } from "@/store";
import { z } from "zod";

type Props = {
  id: number;
  name: string;
  price: string;
  count: number;
  type: string;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: string | undefined | null;
};

const Item = ({ id, name, price, count, type, setStocks, date }: Props) => {
  const { showSnackbar } = useSnackbarContext();
  let [newPrice, setNewPrice] = useState<string>("");
  const tax = useTaxStore((state) => state.tax);
  const user = useStore((state) => state.user);
  const onUpdate = (data: any | undefined) => setStocks(data);

  const handleNewPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPrice(event.target.value);
  };

  // UPDATE 使った日をuse_dateに記録する
  const handleUse = async (propsID: number, userId: string) => {
    if (date !== undefined) {
      try {
        // 使うボタン押下でuse_dateに記録してdailyに移動
        await supabase
          .from("stocks")
          .update({ use_date: date })
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
          showSnackbar("success", `${name}を${date}付けで計上しました。`);
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

  const handleDelete = async (propsID: number, userId: string) => {
    try {
      const { error } = await supabase
        .from("stocks")
        .delete()
        .eq("id", propsID);

      const { data: updatedStocks } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", userId);
      onUpdate(updatedStocks);

      if (error) throw error;
      // 親コンポーネントにstocksを渡して在庫情報を更新

      if (showSnackbar) {
        showSnackbar("success", `${name}を在庫一覧から削除しました。`);
      }
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar("error", "削除できませんでした。" + error.message);
      }
    }
  };

  const handleUpdate = async (propsID: number, userId: string) => {
    if (type === "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.08).toString();
    }
    if (type !== "食品" && tax === false) {
      newPrice = Math.floor(parseInt(newPrice) * 1.1).toString();
    }

    if (parseInt(newPrice) < 1 || newPrice === "") {
      if (showSnackbar) {
        showSnackbar("error", "1円以上の価格を入力してください。");
      }
      return;
    }

    if (parseInt(newPrice) < 0) {
      if (showSnackbar) {
        showSnackbar("error", "価格を入力してください。");
      }
      return;
    }

    if (isNaN(parseInt(newPrice))) {
      if (showSnackbar) {
        showSnackbar("error", "価格は半角の数字を入力してください。");
      }
      return;
    }

    try {
      await supabase
        .from("stocks")
        .update({ price: newPrice })
        .eq("id", propsID);
      const { data: updatedStocks } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", userId);
      onUpdate(updatedStocks);
      if (showSnackbar) {
        showSnackbar("success", `${name}の価格を更新しました。`);
      }
      setNewPrice("");
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar("error", "価格を更新できませんでした。" + error.message);
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
        showSnackbar("success", `${name}を在庫に追加しました。`);
      }
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar(
          "error",
          `${name}を在庫に追加できません。` + error.message
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
        showSnackbar("success", `${name}を在庫一覧から削除しました。`);
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
      let taxExcluded = Math.ceil(parseInt(price) / 1.08).toString();
      return taxExcluded;
    } else if (type !== "食品" && tax === false) {
      let taxExcluded = Math.ceil(parseInt(price) / 1.1).toString();
      return taxExcluded;
    } else {
      return price;
    }
  };

  return (
    <>
      <List
        key={id}
        sx={{
          display: "flex",
          flexDirection: "row",
          // borderBottom:"1px solid",
          // borderBottomColor:"grey.300",
        }}
      >
        {parseInt(price) !== 0 ? (
          <>
            {/* 在庫あり */}
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
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
                <Tooltip title="使用済みにする" placement="bottom">
                  <IconButton
                    aria-label="use-item"
                    color="success"
                    onClick={() => handleUse(id, user.id)}
                  >
                    <CheckCircleTwoTone />
                  </IconButton>
                </Tooltip>

                <Tooltip title="在庫を増やす" placement="bottom">
                  <IconButton
                    aria-label="plus1"
                    color="primary"
                    onClick={() => handlePlus(id, user.id)}
                  >
                    <ControlPointTwoToneIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="在庫を減らす" placement="bottom">
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => handleMinus(id, user.id)}
                  >
                    <RemoveCircleTwoToneIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </>
        ) : (
          <>
            {/* 在庫なし */}
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">{name}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    variant="standard"
                    type="string"
                    size="small"
                    sx={{ m: 0, paddingBlock: 0, width: "7ch" }}
                    value={newPrice}
                    // onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    //   setNewPrice(event.target.value);
                    // }}
                    onChange={handleNewPrice}
                  />
                  <Typography variant="body1">円</Typography>
                  <Typography
                    variant="body2"
                    sx={{ marginLeft: "4px", color: "grey", fontSize: "10px" }}
                  >
                    {tax === true ? "(込)" : "(抜)"}
                  </Typography>

                  <Tooltip title="価格を更新する" placement="bottom">
                    <IconButton
                      aria-label="update"
                      color="success"
                      onClick={() => handleUpdate(id, user.id)}
                    >
                      <ModeTwoTone />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "end",
                }}
              >
                <Tooltip title="一覧から削除する" placement="bottom">
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => handleDelete(id, user.id)}
                  >
                    <DeleteTwoTone />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </>
        )}
      </List>
      <Divider />
    </>
  );
};

export default Item;
