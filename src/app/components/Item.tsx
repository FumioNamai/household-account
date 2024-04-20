
import React from "react";
import { Stock } from "../../../utils/type";
import {
  Divider,
  List,
} from "@mui/material";
import InStockItem from "@/app/components/InStockItem";
import OutOfStockItem from "@/app/components/OutOfStockItem";

type Props = {
  id: number;
  name: string;
  price: number;
  count: number;
  type: string;
  reference_price: number | null;
  selectedDate: string | undefined | null;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  to_buy: boolean;
};

const Item = ({
  id,
  name,
  price,
  reference_price,
  count,
  type,
  selectedDate,
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
        {price !== 0 ? (
          <InStockItem
            id={id}
            name={name}
            price={price}
            count={count}
            type={type}
            selectedDate={selectedDate}
            to_buy={to_buy}
            setStocks={setStocks}
            open = {false}
          />
        ) : (
          <OutOfStockItem
            id={id}
            name={name}
            type={type}
            to_buy={to_buy}
            reference_price={reference_price}
            setStocks={setStocks}
            open = {false}
          />
        )}
      </List>
      <Divider />
    </>
  );
};

export default Item;
