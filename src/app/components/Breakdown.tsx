import { Stack, Typography } from "@mui/material";
import { CalcPrice } from "./CalcPrice";

type Props = {
  typeName: string,
  totalPrice: number,
}

export const Breakdown = ({typeName, totalPrice}: Props) => {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body1">{typeName}</Typography>
      <Typography variant="body1" sx={{ width: "6rem", textAlign: "right" }}>
        {CalcPrice(totalPrice, typeName)}円
      </Typography>
    </Stack>
  );
};
