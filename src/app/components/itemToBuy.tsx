
import { Box, Divider, List, Typography } from "@mui/material";
import { Stock } from "../../../utils/type";
import CheckBox from "./check-box";
import ToBuyButton from "./to-buy-button";
import ModalToBuyList from "./modal-to-buy-list";
import { Dayjs } from "dayjs";

type Props = {
  id: number;
  name: string;
  price: string;
  count: number;
  type: string;
  date: Dayjs | null;
  to_buy: boolean;
  checked:boolean;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const ItemToBuy = ({ id, name, price, count, type, date, to_buy, checked, setStocks }: Props) => {

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
            <ModalToBuyList
              id={id}
              name={name}
              price={price}
              count={count}
              type={type}
              date={date}
              to_buy={to_buy}
              setStocks={setStocks}
            />
            {/* <Typography>{name}</Typography> */}
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
