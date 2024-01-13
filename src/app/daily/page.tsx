const DailyPage = (stocks) => {
  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <p>2024年1月6日(土)</p>
        <div>
          <p>合計:1360円</p>
          <p>食品 小計:730円</p>
          <p>雑貨 小計:630円</p>
        </div>
      </div>

      <div className="">
        <h2 className="mb-4">消費品目</h2>
        <div className="mb-8">
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
          <ul>
            <div className="flex flex-row items-center justify-between p-1 min-w-96 ">
              <li className="text-xs">豚肉</li>
              <div className="flex  items-center ">
                <p className=" text-xs mr-2">単価 [600]円</p>
                <p className=" text-xs mr-2">個数 1</p>
              </div>
            </div>
          </ul>

          <ul>
            <div className="flex flex-row items-center justify-between p-1 min-w-96">
              <li className="text-xs">ヨーグルト</li>
              <div className="flex  items-center ">
                <p className=" text-xs mr-2">単価 [130]円</p>
                <p className=" text-xs mr-2">個数 1</p>
              </div>
            </div>
          </ul>
        </div>

        <div>
          <h2 className="mb-2">雑貨</h2>
          <ul>
            <div className="flex flex-row items-center justify-between p-1 min-w-96 ">
              <li className="text-xs">コーヒーフィルター</li>
              <div className="flex  items-center ">
                <p className=" text-xs mr-2">単価 [110]円</p>
                <p className=" text-xs mr-2">個数 1</p>
              </div>
            </div>
          </ul>
          <ul>
            <div className="flex flex-row items-center justify-between p-1 min-w-96">
              <li className="text-xs">アルコール消毒液詰め替え</li>
              <div className="flex  items-center ">
                <p className=" text-xs mr-2">単価 [500]円</p>
                <p className=" text-xs mr-2">個数 1</p>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DailyPage;
