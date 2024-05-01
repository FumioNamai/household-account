
import React from "react";
import {
  Divider,
  List,
} from "@mui/material";
import InStockItem from "@/app/components/InStockItem";
import OutOfStockItem from "@/app/components/OutOfStockItem";
import { GroupedData } from "../../../utils/type";

const Item = ({ ...groupedData }: GroupedData) => {
  return (
    <>
      <List
        key={groupedData.id}
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {groupedData.price !== 0 ? (
          <InStockItem {...groupedData} />
        ) : (
          <OutOfStockItem {...groupedData} />
        )}
      </List>
      <Divider />
    </>
  );
};

export default Item;
