
import React from "react";
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
  to_buy: boolean;
};

const Item = ({
  id,
  name,
  price,
  reference_price,
  count,
  type,
  to_buy,
}: Props) => {
  return (
    <>
      <List
        key={id}
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {price !== 0 ? (
          <InStockItem
            id={id}
            name={name}
            price={price}
            count={count}
            type={type}
            to_buy={to_buy}
          />
        ) : (
          <OutOfStockItem
            id={id}
            name={name}
            type={type}
            to_buy={to_buy}
            reference_price={reference_price}
          />
        )}
      </List>
      <Divider />
    </>
  );
};

export default Item;
