import { useState } from "react";
import { Stock } from "../../../utils/interface";
import { supabase } from "../../../utils/supabase";

const Item = ({ props, onUpdate, onDelete, date }) => {
  // UPDATE 使った日をuse_dateに記録する
  const handleUse = async (propsID: number) => {
    try {

      // 使うボタンで選択した項目をnewStockへコピー
      const { data: restocks, error } = await supabase.from("stocks").select().eq("id", propsID);
      const newStock = {
        id: undefined,
        type: restocks[0].type,
        category: restocks[0].category,
        name: restocks[0].name,
        price: 0,
        registration_date: null,
        use_date: null,
      };

      // 使うボタン押下でuse_dateに記録してdailyに移動
      const { data: stocks } = await supabase.from("stocks").update({ use_date: date }).eq("id", propsID);

      // newStockを在庫に登録（使うボタンで選択した項目を複製して在庫リストに残す）
      await supabase.from("stocks").insert({ ...newStock });

      // 在庫データを更新して、画面を更新
      const { data: updatedStocks } = await supabase.from("stocks").select("*");
      onUpdate(updatedStocks);

    } catch (error) {
      alert("使用日登録ができませんでした" + error.message);
    }
  };

  const handleDelete = async (propsID: number) => {
    try {
      const res = await supabase.from("stocks").delete().eq("id", propsID);
      const { data: stocks } = await supabase.from("stocks").select("*");
      // 親コンポーネントにstocksを渡して在庫情報を更新
      onDelete(stocks);
    } catch (error) {
      alert("削除できませんでした" + error.message);
    }
  };

  return (
    <>
      <li
        key={props.id}
        className="flex flex-row items-center justify-between p-1 min-w-60"
      >
        <p className="text-xs max-w-28">{props.name}</p>
        <div className="flex  items-center ">
          <p className=" text-xs mr-1 min-w-16 text-end">@ {props.price}円</p>
          <button
            className="border mr-1 p-1 text-xs"
            onClick={() => handleUse(props.id)}
          >
            使
          </button>
          <button
            className="border mr-1 p-1 text-xs"
            onClick={() => handleDelete(props.id)}
          >
            消
          </button>
        </div>
      </li>
    </>
  );
};

export default Item;
