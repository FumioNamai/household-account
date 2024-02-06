// 未使用コンポーネント？

"use client";

import { useEffect, useState } from "react";
import { Stock } from "../../../utils/type";
import { addStock, getAllStocks } from "../../../utils/supabaseFunctions";
import Item from "./Item";
import { supabase } from "../../../utils/supabase";
import { useRouter } from "next/navigation";

type Props = {
  stocks: Stock[];
};

const Stock = (props: Props) => {
  const { stocks } = props;
  const router = useRouter()
  const [type, setType] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [price, setPrice] = useState<string>("")

  useEffect(() => {
    (async () => await getAllStocks())()
  },[])

  const handleForm =async (e: any) => {
    e.preventDefault()
    try {
      const {error} = await supabase.from("stocks").insert(
        {
          type:type,
          name:name,
          price:price,
        }
      )
      if(error) throw error
      setType("")
      setName("")
      setPrice("")
      await getAllStocks()
    } catch (error) {
      alert("データの新規登録ができません")
    }
  }


  const handleSubmit = async() => {
      const {error} = await supabase.from("stocks").insert(
        {
          type:type,
          name:name,
          price:price
        }
      )
  }

  return (
    <div>
      <h2 className="mb-4">在庫登録</h2>
      <div className="mb-10">
        <form className="" onSubmit={handleForm}>
          {/* <button className="border text-xs p-1 mr-2 ">種別</button> */}
          <div className="flex flex-row items-center gap-1">
            <input type="radio" id="foods" name="type" value="食品"
            checked={type === "食品" }
            onChange={(e) => setType(e.target.value)}/>
            <label htmlFor="foods" className="text-xs">
              食品
            </label>
            <input type="radio" id="items" name="type" value="雑貨"
            checked={type === "雑貨" }
            onChange={(e) => setType(e.target.value)}
            />
            <label htmlFor="items" className="text-xs">
              雑貨
            </label>
            <input type="radio" id="others" name="type" value="その他"
            checked={type === "その他" }
            onChange={(e) => setType(e.target.value)}
            />
            <label htmlFor="others" className="text-xs">
              その他
            </label>
          </div>
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
            <input type="radio" id="taxExclude" name="tax" value="taxExclude" />
            <label htmlFor="taxExclude" className="text-xs">
              税抜
            </label>
            <input type="radio" id="taxInclude" name="tax" value="taxInclude" />
            <label htmlFor="taxInclude" className="text-xs">
              税込
            </label>
            <input
              type="text"
              pattern="^[1-9][0-9]*$"
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
            <div className="flex justify-evenly">
              <button type="submit" className="border text-xs p-1 mr-2"
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
            {stocks.map((stock) => (
              <div key={stock.id}>
                {stock.type === "食品" && stock.use_date === null ? (
                  <Item props={stock} />
                ) : null}
              </div>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="mb-2">雑貨</h2>
      <div>
        <ul>
          {stocks.map((stock) => (
            <div key={stock.id}>
              {stock.type === "雑貨" && stock.use_date === null ? (
                <Item props={stock} />
              ) : null}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

// export default Stock;
