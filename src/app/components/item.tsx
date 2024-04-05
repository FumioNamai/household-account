import React from "react";
import { Stock } from "../../../utils/type";
import {
  Divider,
  List,
} from "@mui/material";
import InStockItem from "./in-stock-item";
import OutOfStockItem from "./out-of-stock-item";

type Props = {
  id: number;
  name: string;
  price: string;
  count: number;
  type: string;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: string | undefined | null;
  to_buy: boolean;
};

const Item = ({
  id,
  name,
  price,
  count,
  type,
  date,
  to_buy,
  setStocks,
}: Props) => {
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
          <InStockItem
            id={id}
            name={name}
            price={price}
            count={count}
            type={type}
            date={date}
            to_buy={to_buy}
            setStocks={setStocks}
          />
        ) : (
          <OutOfStockItem
            id={id}
            name={name}
            type={type}
            to_buy={to_buy}
            setStocks={setStocks}
          />
        )}
      </List>
      <Divider />
    </>
  );
};

export default Item;
