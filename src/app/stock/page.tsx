"use client";

import Item from "../components/item";

const stocks = [
  {
    id: 1,
    type: "食品",
    name: "豚肉",
    price: 600,
  },
  {
    id: 2,
    type: "食品",
    name: "ヨーグルト",
    price: 130,
  },
  {
    id: 3,
    type: "雑貨",
    name: "コーヒーフィルター",
    price: 110,
  },
  {
    id: 4,
    type: "雑貨",
    name: "アルコール消毒液詰め替え",
    price: 500,
  },
];

const StockPage = () => {
  // const [count, setCount] = useState(0)
  // const countUp = () => setCount(count + 1)
  // const countDown = () => setCount(count - 1)

  return (
    <div>
      <h2 className="mb-4">在庫登録</h2>
      <div className="mb-10">
        <form className="">
          <button className="border text-xs p-1 mr-2 ">種別</button>
          <input
            type="text"
            placeholder="商品名"
            className="border text-xs p-1 mr-4 mb-2 focus:outline-none focus:border-sky-500"
          />
          <div className="flex flex-row ">
            <input
              type="text"
              placeholder="単価"
              className="border text-xs p-1 w-20 mr-2 focus:outline-none focus:border-sky-500"
            />
            <button className="border text-xs p-1 mr-2 ">税込抜き</button>
            <input
              type="text"
              placeholder="個数"
              className="border text-xs p-1 w-10 mr-2 focus:outline-none focus:border-sky-500"
            />
            <button type="" className="border text-xs p-1 mr-2">
              リセット
            </button>
            <button type="submit" className="border text-xs p-1 mr-2">
              登録
            </button>
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
                {stock.type === "食品" ? <Item props={stock} /> : null}
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
              {stock.type === "雑貨" ? <Item props={stock} /> : null}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StockPage;
