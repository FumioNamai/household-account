import { Box, Button, Modal } from "@mui/material";
import { useState } from "react";
import StockRegistration from "./StockRegistration";

export default function ModalStockRegistration({
  stocks,
  setStocks,
  tax,
  setTax,
  price,
  setPrice,
  date,
  setDate
  }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
    <Box sx={{marginBlock:"8px"}}>
      <Button variant="outlined" size="large" onClick={handleOpen}>在庫登録</Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95%",
            bgcolor: "background.paper",
            // border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <StockRegistration
            stocks={stocks}
            setStocks={setStocks}
            tax={tax}
            setTax={setTax}
            price={price}
            setPrice={setPrice}
            date={date}
            setDate={setDate}
          />
          <Button onClick={handleClose}>閉じる</Button>
        </Box>
      </Modal>
    </>
  );
}