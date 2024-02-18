import { Box, Button, Modal } from "@mui/material";
import { useState } from "react";
import StockRegistration from "./StockRegistration";
import { Stock } from "../../../utils/type";
import dayjs, { Dayjs } from "dayjs";

type Props = {
  stocks: Stock[];
  setStocks:React.Dispatch<React.SetStateAction<Stock[]>>;
  // tax: boolean;
  // setTax: React.Dispatch<React.SetStateAction<boolean>>;
  // price:string;
  // setPrice: React.Dispatch<React.SetStateAction<number>>;
  date: Dayjs | null;
  setDate:React.Dispatch<React.SetStateAction<Dayjs | null>>;
}

export default function ModalStockRegistration({
  stocks,
  setStocks,
  // tax,
  // setTax,
  // price,
  // setPrice,
  date,
  setDate,
  }: Props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // let [date, setDate] = useState<Dayjs | null>(dayjs());

  return (
    <>
    <Box>
      <Button variant="outlined" size="large" onClick={handleOpen}>在庫登録</Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ maxWidth: "sm", mx:"auto" }}
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxHeight:"90%",
            overflow:"scroll",
            bgcolor: "background.paper",
            // border: '2px solid #000',
            boxShadow: 24,
            p: 2,
          }}
        >
          <StockRegistration
            stocks={stocks}
            setStocks={setStocks}
            // tax={tax}
            // setTax={setTax}
            // price={price}
            // setPrice={setPrice}
            date={date}
            setDate={setDate}
          />
          <Button onClick={handleClose}>閉じる</Button>
        </Box>
      </Modal>
    </>
  );
}
