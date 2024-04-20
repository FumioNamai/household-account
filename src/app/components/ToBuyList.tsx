import { GroupedData, Stock } from "../../../utils/type";
import { Box, Grid, Typography } from "@mui/material";
import ItemToBuy from "@/app/components/ItemToBuy";

type Props = {
  groupedDataArr: GroupedData[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  selectedDate: string | undefined | null;
};

const ToBuyList = ({ groupedDataArr, setStocks, selectedDate}: Props) => {
  return (
    <Grid item xs={12} sx={{ marginBottom: "80px" }}>
      <Box>
        <Typography variant="h2" sx={{ fontSize: "24px" }}>
          買い物リスト
        </Typography>

        <ul>
          {groupedDataArr
            .sort((a, b) => a.name.localeCompare(b.name, "ja"))
            .map(
              (groupedData) =>
                groupedData.to_buy === true && (
                  <ItemToBuy
                    key={groupedData.id}
                    id={groupedData.id}
                    name={groupedData.name}
                    type={groupedData.type}
                    price={groupedData.price}
                    reference_price={groupedData.reference_price}
                    count={groupedData.count}
                    to_buy={groupedData.to_buy}
                    checked={groupedData.checked}
                    selectedDate={selectedDate}
                    setStocks={setStocks}
                  />
                )
            )}
        </ul>
      </Box>
    </Grid>
  );
};

export default ToBuyList;
