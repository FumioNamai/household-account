import { GroupedData, Stock } from "../../../utils/type";
import { Box, Grid, Typography } from "@mui/material";
import ItemToBuy from "./itemToBuy";

type Props = {
  groupedDataArr: GroupedData[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
};

const ToBuyList = ({ groupedDataArr, setStocks }: Props) => {
  return (
    <Grid item xs={12} sx={{ marginBottom: "80px" }}>
      <Box>
        <Typography variant="h2" sx={{ fontSize: "24px" }}>
          買い物リスト
        </Typography>
        <ul>
          {groupedDataArr.map(
            (groupedData) =>
              groupedData.to_buy === true && (
                <ItemToBuy
                  key={groupedData.id}
                  id={groupedData.id}
                  to_buy={groupedData.to_buy}
                  name={groupedData.name}
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
