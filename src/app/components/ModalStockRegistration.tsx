import { Box, Button, Modal } from "@mui/material";
import { useState } from "react";
import StockRegistration from "@/app/components/StockRegistration";
import { GroupedData, Stock } from "../../../utils/type";
import { Dayjs } from "dayjs";

type Props = {
  groupedDataArr : GroupedData[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
};

export default function ModalStockRegistration({
  groupedDataArr,
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
        <Button variant="outlined" size="large" onClick={handleOpen}>
          在庫 / 商品登録
        </Button>
      </Box>
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
            maxHeight: "90%",
            overflow: "scroll",
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: "16px",
          }}
        >
          <StockRegistration
            groupedDataArr={groupedDataArr}
            setStocks={setStocks}
            date={date}
            setDate={setDate}
          />
          <Button
            onClick={handleClose}
            size="small"
            color="error"
            variant="outlined"
            sx={{ marginTop: "30px" }}
          >
            閉じる
          </Button>
        </Box>
      </Modal>
    </>
  );
}
