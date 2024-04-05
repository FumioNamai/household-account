import { Box, Button, Modal } from "@mui/material";
import { Stock } from "../../../utils/type";
import { useState } from "react";
import InStockItem from "./in-stock-item";
import OutOfStockItem from "./out-of-stock-item";

type Props = {
  id: number;
  name: string;
  price: string;
  count: number;
  type: string;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  selectedDate: string | undefined | null;
  to_buy: boolean;
};

const ModalToBuyList = ({
  id,
  name,
  price,
  count,
  type,
  selectedDate,
  to_buy,
  setStocks,
}: Props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{textTransform:"none", justifyContent:"left"}}>{name}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ maxWidth: "sm", mx: "auto" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: "8px",
          }}
        >
          {parseInt(price) !== 0 ? (
            <InStockItem
              id={id}
              name={name}
              price={price}
              count={count}
              type={type}
              selectedDate={selectedDate}
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
        </Box>
      </Modal>
    </>
  );
};

export default ModalToBuyList;
