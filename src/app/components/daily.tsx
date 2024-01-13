"use client"

import { useState } from "react";
import { Stock } from "../../../utils/interface";
import UsedItem from "./usedItem";

type Props = {
  stocks: Stock[];
}

const Daily = (props:Props) => {
  const { stocks } = props
  const [date, setDate] = useState("")

  // const todayUsed = stocks.filter((stock) => stock.use_date === `${date}` )

  const todayFoods = todayUsed.filter((todayUsed) =>todayUsed.type ==="食品" )
  const todaysFoodsTotal = todayFoods.reduce((sum,el) => {
    return sum + el.price
  },0)

  const todayItems = todayUsed.filter((todayUsed) =>todayUsed.type ==="雑貨" )
  const todaysItemsTotal = todayItems.reduce((sum,el) => {
    return sum + el.price
  },0)

  const total = todaysFoodsTotal + todaysItemsTotal


  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <form >
          <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
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
                {todayFood.type === "食品" && todayFood.use_date === `${date}` ? <UsedItem props={todayFood} /> : null}
              </div>
              ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-2">雑貨</h2>
          <ul>
          {todayItems.map((todayItem) => (
              <div key={todayItem.id}>
                {todayItem.type === "雑貨" && todayItem.use_date === `${date}` ? <UsedItem props={todayItem} /> : null}
              </div>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Daily;
