
import React from "react";
import {
  Box,
  Divider,
  List,
} from "@mui/material";
import InStockItem from "@/app/components/InStockItem";
import OutOfStockItem from "@/app/components/OutOfStockItem";
import { GroupedData } from "../../../utils/type";

const Item = ({ ...groupedData }: GroupedData) => {
  return (
    <>
      <Box
        key={groupedData.id}
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {groupedData.price ? (
          <InStockItem {...groupedData} />
        ) : (
          <OutOfStockItem {...groupedData} />
        )}
      </Box>
      <Divider />
    </>
  );
};

export default Item;
