
import { Box, Divider, List, Typography } from "@mui/material";
import { Stock } from "../../../utils/type";
import CheckBox from "./check-box";
import ToBuyButton from "./to-buy-button";

type Props = {
  id: number;
  name: string;
  to_buy: boolean;
  checked: boolean;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const ItemToBuy = ({ id, name, to_buy, checked, setStocks }: Props) => {

  return (
    <>
      <List key={id}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <CheckBox
              id={id}
              name={name}
              checked={checked}
              setStocks={setStocks}
            />
            <Typography>{name}</Typography>
            </Box>
            <ToBuyButton
              id={id}
              name={name}
              to_buy={to_buy}
              setStocks={setStocks}
            />
        </Box>
      </List>
      <Divider />
    </>
  );
};

export default ItemToBuy;
