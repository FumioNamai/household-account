import { GroupedData, Stock } from "../../../utils/type";
import { Box, Grid, Stack, Typography } from "@mui/material";
import ItemToBuy from "@/app/components/ItemToBuy";
import { ShopList } from "./ShopList";
import ModalToBuyRegistration from "./ModalToBuyRegistration";
import TaxSwitch from "./TaxSwitch";

type Props = {
  groupedDataArr: GroupedData[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  selectedDate: string | undefined | null;
};

const ToBuyList = ({ groupedDataArr, setStocks, selectedDate }: Props) => {
  return (
    <Box sx={{ marginBottom: "80px" }}>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            marginBottom: "24px",
          }}
        >
          <Typography variant="h2" sx={{ fontSize: "24px" }}>
            買い物リスト
          </Typography>
          <ModalToBuyRegistration
            groupedDataArr={groupedDataArr}
            setStocks={setStocks}
          />
        </Stack>
        {/* 税表示切替 */}
        <Stack direction="row" justifyContent="end" sx={{ marginRight: "8px" }}>
          <TaxSwitch />
        </Stack>

        {ShopList.map((shop) =>
          groupedDataArr.some(
            (groupedData) =>
              groupedData.shop_name === shop.shopName && groupedData.to_buy
          ) ? (
            <Box
              key={shop.id}
              sx={{
                boxShadow: 2,
                padding: "16px",
                borderRadius: 2,
                marginBlock: "10px",
              }}
            >
              <Typography variant="body1">
                {shop.shopName ? shop.shopName : "未分類"}
              </Typography>
              <ul>
                {groupedDataArr.map(
                  (groupedData) =>
                    groupedData.to_buy === true &&
                    groupedData.shop_name === shop.shopName && (
                      <ItemToBuy
                        key={groupedData.id}
                        id={groupedData.id}
                        name={groupedData.name}
                        type={groupedData.type}
                        category={groupedData.category!}
                        price={groupedData.price}
                        reference_price={groupedData.reference_price}
                        count={groupedData.count}
                        to_buy={groupedData.to_buy}
                        checked={groupedData.checked}
                        selectedDate={selectedDate}
                        shop_name={groupedData.shop_name}
                        setStocks={setStocks}
                      />
                    )
                )}
              </ul>
            </Box>
          ) : null
        )}
        {groupedDataArr.some((groupedData) => groupedData.to_buy) ? null : (
          <Box
            sx={{
              boxShadow: 2,
              padding: "16px",
              borderRadius: 2,
              marginBlock: "10px",
            }}
          >
            <Typography variant="body1">
              買い物リストは空です
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ToBuyList;
