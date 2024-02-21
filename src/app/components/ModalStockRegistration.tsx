import { Box, Button, Modal } from "@mui/material";
import { useState } from "react";
import StockRegistration from "./StockRegistration";
import { Stock } from "../../../utils/type";
import { Dayjs } from "dayjs";

type Props = {
  stocks: Stock[] | null;
  setStocks:React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate:React.Dispatch<React.SetStateAction<Dayjs | null>>;
}

export default function ModalStockRegistration({
  stocks,
  setStocks,
  date,
  setDate,
  }: Props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
            date={date}
            setDate={setDate}
          />
          <Button onClick={handleClose}>閉じる</Button>
        </Box>
      </Modal>
    </>
  );
}
