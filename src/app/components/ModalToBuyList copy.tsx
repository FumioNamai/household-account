import { Box, Button, Modal, Typography } from "@mui/material";
import { Stock } from "../../../utils/type";
import { useState } from "react";
import InStockItem from "@/app/components/InStockItem";
import OutOfStockItem from "@/app/components/OutOfStockItem";

type Props = {
  id: number;
  name: string;
  price: number;
  reference_price: number | null;
  count: number;
  type: string;
  category: string;
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  selectedDate: string | undefined | null;
  to_buy: boolean;
};

const ModalToBuyList = ({
  id,
  name,
  price,
  reference_price,
  count,
  type,
  category,
  selectedDate,
  to_buy,
  setStocks,
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const [toggle, setToggle] = useState(false);
  const handleSwitch = () => setToggle(!toggle);

  return (
    <>
      <Button
        onClick={handleModalOpen}
        sx={{ textTransform: "none", justifyContent: "left" }}
      >
        {name}
      </Button>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
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
          {price !== 0 ? (
            <Box>
              {
              toggle ?
                <OutOfStockItem
                  id={id}
                  name={name}
                  price={price}
                  type={type}
                  category={category}
                  to_buy={to_buy}
                  reference_price={reference_price}
                  setStocks={setStocks}
                  modalOpen={modalOpen}
                />
              :
                <InStockItem
                  id={id}
                  name={name}
                  price={price}
                  count={count}
                  type={type}
                  selectedDate={selectedDate}
                  to_buy={to_buy}
                  setStocks={setStocks}
                  modalOpen={modalOpen}
                />
              }
              <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"right"}}>
              <Typography variant="body2">価格を</Typography>
              <Button onClick={handleSwitch}>
                {
                  toggle ? "変更しない" : "変更する"
                }
              </Button>
              </Box>
            </Box>
          ) : (
            <OutOfStockItem
              id={id}
              name={name}
              price={price}
              type={type}
              category={category}
              to_buy={to_buy}
              reference_price={reference_price}
              setStocks={setStocks}
              modalOpen={modalOpen}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ModalToBuyList;
