"use client";

import Link from "next/link";
import Stock from "./components/stock";
import Daily from "./components/daily";
import { useEffect, useState } from "react";
import { getAllStocks } from "../../utils/supabaseFunctions";
import UsedItem from "./components/usedItem";
import { supabase } from "../../utils/supabase";
import Item from "./components/item";
import { log } from "console";

const today = new Date().toLocaleDateString("sv-SE");

export default function Home() {
  const [stocks, setStocks] = useState<any>([]);
  const [date, setDate] = useState(today);

  const [type, setType] = useState<string>("");
  const [name, setName] = useState<string>("");
  let [price, setPrice] = useState<string>("");
  const [taxNotation, setTaxNotation] = useState({
    tax: "税抜",
  });
  const [categoryItem, setCategoryItem] = useState("")

  useEffect(() => {
    (async () => await getStocks())();
  }, []);

  // 全ての在庫情報を取得
  const getStocks = async () => {
    try {
      const { data, error } = await supabase.from("stocks").select("*");
      if (error) throw error;
      setStocks(data);
    } catch (error) {
      alert(error.message);
      setStocks([]);
    }
  };

  // Itemコンポーネントの使用ボタン押下でuse_dateを更新
  const update = (props) => setStocks(props);

  // Itemコンポーネントの削除ボタン押下で在庫情報を更新
  const del = (props) => setStocks(props);

  const todayUsed = stocks.filter((stock) => stock.use_date === `${date}`);

  // その日に使用した食品の合計金額を算出
  const todayFoods = todayUsed.filter((todayUsed) => todayUsed.type === "食品");
  const todaysFoodsTotal = todayFoods.reduce((sum, el) => {
    return sum + el.price;
  }, 0);
  // その日に使用した雑貨の合計金額を算出
  const todayItems = todayUsed.filter((todayUsed) => todayUsed.type === "雑貨");
  const todaysItemsTotal = todayItems.reduce((sum, el) => {
    return sum + el.price;
  }, 0);
  // その月に使用したその他の合計金額を算出

  // その日の合計金額を算出
  const total = todaysFoodsTotal + todaysItemsTotal;


  // 在庫登録
  const handleForm = async (e: any) => {
    e.preventDefault();
    if (type === "食品" && taxNotation.tax === "税抜") {
      price = Math.floor(price * 1.08);
    }
    if (type !== "食品" && taxNotation.tax === "税抜") {
      price = Math.floor(price * 1.1);
    }

    try {
      const { error } = await supabase.from("stocks").insert({
        type: type,
        name: name,
        price: price,
        registration_date: date,
        category: categoryItem,
      });
      if (error) throw error;

      setType("");
      setName("");
      setPrice("");
      setCategoryItem("")
      await getStocks();
    } catch (error) {
      alert("データの新規登録ができません");
    }
  };

  const handleTax = (e) => {
    setTaxNotation({
      ...taxNotation,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectItem = (e) => {
    setCategoryItem(e.target.value)
  }

  return (
    <>
      <main>
        <div className="flex gap-4">
          {/* <Stock stocks={stocks}/> */}
          <div>
            <h2 className="mb-4">在庫登録</h2>
            <div className="mb-10">
              <form className="" onSubmit={handleForm}>
                <p>購入日</p>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {/* <button className="border text-xs p-1 mr-2 ">種別</button> */}
                <p>種別</p>
                <div className="flex flex-row items-center gap-1">
                  <input
                    type="radio"
                    id="foods"
                    name="type"
                    value="食品"
                    checked={type === "食品"}
                    onChange={(e) => setType(e.target.value)}
                  />
                  <label htmlFor="foods" className="text-xs">
                    食品
                  </label>
                  <input
                    type="radio"
                    id="items"
                    name="type"
                    value="雑貨"
                    checked={type === "雑貨"}
                    onChange={(e) => setType(e.target.value)}
                  />
                  <label htmlFor="items" className="text-xs">
                    雑貨
                  </label>
                  <input
                    type="radio"
                    id="others"
                    name="type"
                    value="その他"
                    checked={type === "その他"}
                    onChange={(e) => setType(e.target.value)}
                  />
                  <label htmlFor="others" className="text-xs">
                    その他
                  </label>
                </div>
                <p>分類</p>
                <label htmlFor="">

                <select
                name="category"
                id="category"
                value={categoryItem}
                onChange={handleSelectItem}
                >
                  <option value="">---</option>
                  <option value="肉">肉</option>
                  <option value="魚介">魚介</option>
                  <option value="野菜">野菜</option>
                  <option value="乾物">乾物</option>
                  <option value="フルーツ">フルーツ</option>
                  <option value="調味料">調味料</option>
                  <option value="お菓子">お菓子</option>
                  <option value="その他">その他</option>
                </select>
                  </label>
                {/* 在庫登録 兼 在庫検索機能 */}
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="商品名"
                  className="border text-xs p-1 mr-4 mb-2 focus:outline-none focus:border-sky-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="flex flex-row items-center gap-1">
                  <input
                    type="radio"
                    id="taxExclude"
                    name="tax"
                    value="税抜"
                    checked={taxNotation.tax === "税抜"}
                    onChange={handleTax}
                  />
                  <label htmlFor="taxExclude" className="text-xs">
                    税抜
                  </label>
                  <input
                    type="radio"
                    id="taxInclude"
                    name="tax"
                    value="税込"
                    checked={taxNotation.tax === "税込"}
                    onChange={handleTax}
                  />
                  <label htmlFor="taxInclude" className="text-xs">
                    税込
                  </label>
                  <input
                    type="number"
                    // pattern="^[1-9][0-9]*$"
                    id="price"
                    name="price"
                    className="border text-xs text-right p-1 w-20 focus:outline-none focus:border-sky-500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <p className="text-xs">円</p>
                </div>

                <div className="flex flex-col">
                  {/* <input
              type="text"
              placeholder="個数"
              className="border text-xs p-1 w-10 mr-2 focus:outline-none focus:border-sky-500"
            /> */}
                  <div>
                    <button
                      type="submit"
                      className="border text-xs p-1 mr-2"
                      //  onClick={handleSubmit}
                    >
                      登録
                    </button>
                    {/* <button type="" className="border text-xs p-1 mr-2">
                リセット
              </button> */}
                  </div>
                </div>
              </form>
            </div>
            <h2 className="mb-4">在庫一覧</h2>
            <div className="mb-10">
              <h2 className="mb-2">食品</h2>
              <div>
                <ul>
                  {stocks
                    .sort((a, b) => b.id - a.id)
                    .map((stock) => (
                      <div key={stock.id}>
                        {stock.type === "食品" && stock.use_date === null ? (
                          <Item
                            props={stock}
                            onDelete={del}
                            onUpdate={update}
                            date={date}
                          />
                        ) : null}
                      </div>
                    ))}
                </ul>
              </div>
            </div>

            <h2 className="mb-2">雑貨</h2>
            <div>
              <ul>
                {stocks
                  .sort((a, b) => b.id - a.id)
                  .map((stock) => (
                    <div key={stock.id}>
                      {stock.type === "雑貨" && stock.use_date === null ? (
                        <Item
                          props={stock}
                          onDelete={del}
                          onUpdate={update}
                          date={date}
                        />
                      ) : null}
                    </div>
                  ))}
              </ul>
            </div>
          </div>

          {/* <Daily stocks={stocks}/> */}
          <div className="flex flex-col">
            <div className="mb-10">
              <form>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </form>
              <div>
                <p>合計:{total}円</p>
                <p>食品 小計:{todaysFoodsTotal}円</p>
                <p>雑貨 小計:{todaysItemsTotal}円</p>
              </div>
            </div>

            <div className="">
              <h2 className="mb-4">消費品目</h2>
              <div className="mb-8">
                <h2 className="mb-2">食品</h2>
                <ul>
                  {todayFoods.map((todayFood) => (
                    <div key={todayFood.id}>
                      {todayFood.type === "食品" &&
                      todayFood.use_date === `${date}` ? (
                        <UsedItem props={todayFood} onUpdate={update}
                        />
                      ) : null}
                    </div>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mb-2 ">雑貨</h2>
                <ul>
                  {todayItems.map((todayItem) => (
                    <div key={todayItem.id}>
                      {todayItem.type === "雑貨" &&
                      todayItem.use_date === `${date}` ? (
                        <UsedItem props={todayItem} onUpdate={update}
                        />
                      ) : null}
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
