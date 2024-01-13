"use client";

import { useEffect, useState } from "react";
import { getAllStocks } from "../../../utils/supabaseFunctions";

const Monthly = () => {
  const [month, setMonth] = useState("");

  const [stocks, setStocks] = useState<any>([]);
  useEffect(() => {
    const getStocks = async () => {
      const stocks = await getAllStocks();
      setStocks(stocks);
    };
    getStocks();
  }, []);

  let date = 0;
  let dailyTotals = [];
  for (let i = 1; i < 32; i++) {
    date = ("00" + `${i}`).slice(-2);
    const todayUsed = stocks.filter(
      (stock) => stock.use_date === `${month}-${date}`
    );

    const todaysFoodsTotal = todayUsed
      .filter((todayUsed) => todayUsed.type === "食品")
      .reduce((sum, el) => {
        return sum + el.price;
      }, 0);

    const todaysItemsTotal = todayUsed
      .filter((todayUsed) => todayUsed.type === "雑貨")
      .reduce((sum, el) => {
        return sum + el.price;
      }, 0);

    dailyTotals.push({ date, todaysFoodsTotal, todaysItemsTotal });
  }

  const monthlyFoodsTotal = dailyTotals.reduce((sum, el) => {
    return sum + el.todaysFoodsTotal;
  }, 0);

  const monthlyItemsTotal = dailyTotals.reduce((sum, el) => {
    return sum + el.todaysItemsTotal;
  }, 0);

  const monthlyTotal = monthlyFoodsTotal + monthlyItemsTotal;

  return (
    <>
      <h2>月間合計</h2>
      <div className="mb-10">
        <form>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </form>
        <div className="flex">
          <p>合計:</p>
          <p className=" w-20 text-right">{monthlyTotal}円</p>
        </div>
        <div className="flex">
          <p className="w-12 mr-4 text-end">内訳</p>
          <div className="flex mr-4">
            <p>食品:</p>
            <p className=" w-16 text-right">{monthlyFoodsTotal}円</p>
          </div>
          <div className="flex">
            <p>雑貨:</p>
            <p className=" w-16 text-right">{monthlyItemsTotal}円</p>
          </div>
        </div>
      </div>
      <div>
        <h2>日別</h2>
        <ul>
          {dailyTotals.map((dailyTotal) =>
            dailyTotal.todaysFoodsTotal ? (
              <li key={dailyTotal.date} className="flex">
                <p className="w-12 text-end mr-4">{dailyTotal.date}日</p>
                <p>食品:</p>
                <p className="w-16 text-end mr-4">{dailyTotal.todaysFoodsTotal}円</p>
                <p>雑貨:</p>
                <p className="w-16 text-end">{dailyTotal.todaysItemsTotal}円</p>
              </li>
            ) : null
          )}
        </ul>
      </div>
    </>
  );
};

export default Monthly;
