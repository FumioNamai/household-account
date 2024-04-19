
import { Box, Divider, List } from "@mui/material";
import { Stock } from "../../../utils/type";
import CheckBox from "@/app/components/check-box";
import ModalToBuyList from "@/app/components/ModalToBuyList";
import ToBuyButton from "@/app/components/ToBuyButton";

type Props = {
  id: number;
  name: string;
  price: string;
  count: number;
  type: string;
  selectedDate: string | undefined | null;
  to_buy: boolean;
  checked:boolean;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const ItemToBuy = ({ id, name, price, count, type, selectedDate, to_buy, checked, setStocks }: Props) => {

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
              selectedDate={selectedDate}
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
