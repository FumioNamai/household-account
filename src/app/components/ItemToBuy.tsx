import { Box, Divider, List, Typography } from "@mui/material";
import { Stock } from "../../../utils/type";
import CheckBox from "@/app/components/CheckBox";
import ModalToBuyList from "@/app/components/ModalToBuyList";
import ToBuyButton from "@/app/components/ToBuyButton";
import { useTaxStore } from "@/store";

type Props = {
  id: number;
  name: string;
  price: number;
  reference_price: number | null;
  count: number;
  type: string;
  category: string;
  selectedDate: string | undefined | null;
  to_buy: boolean;
  checked:boolean;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const ItemToBuy = ({ id, name, price,reference_price, count, type, category,selectedDate, to_buy, checked, setStocks }: Props) => {
  const tax = useTaxStore((state) => state.tax);
    // 税抜き⇔税込みで表示金額を切り替える処理
    const calcPrice = () => {
      if (type === "食品" && tax === false) {
        let taxExcluded = Math.ceil(reference_price! / 1.08);
        return taxExcluded;
      } else if (type !== "食品" && tax === false) {
        let taxExcluded = Math.ceil(reference_price! / 1.1);
        return taxExcluded;
      } else {
        return reference_price;
      }
    };

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
              reference_price={reference_price}
              count={count}
              type={type}
              category={category}
              selectedDate={selectedDate}
              // to_buy={to_buy}
              setStocks={setStocks}
            />
            {/* <Typography>{name}</Typography> */}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Typography
              variant="body1"
              sx={{ minWidth: "80px", textAlign: "end" }}
            >
              {calcPrice()}円
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginLeft: "4px", color: "grey", fontSize: "10px" }}
            >
              {tax === true ? "(込)" : "(抜)"}
            </Typography>
          <Typography
              variant="caption"
              sx={{ minWidth: "40px", textAlign: "end", color:"grey"}}
            >
              (参考)
            </Typography>
            <ToBuyButton
              id={id}
              name={name}
              to_buy={to_buy}
              setStocks={setStocks}
            />
            </Box>
        </Box>
      </List>
      <Divider />
    </>
  );
};

export default ItemToBuy;
