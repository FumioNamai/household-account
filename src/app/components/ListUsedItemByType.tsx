import { Typography } from "@mui/material";
import UsedItem from "./UsedItem";
import { Stock } from "../../../utils/type";

type Props = {
  typeName : string;
  todayUsedItems : Stock[];
  selectedDate : string | undefined;
  setStocks : React.Dispatch<React.SetStateAction<Stock[]>>;
};

export const ListUsedItemByType = ({
  typeName,
  todayUsedItems,
  selectedDate,
  setStocks
}: Props) => {
  return (
    <>
      <Typography variant="subtitle1">{typeName}</Typography>
      <ul>
        {todayUsedItems.map((todayUsedItem: Stock) => (
          <div key={todayUsedItem.id}>
            {todayUsedItem.type === `${typeName}` &&
              todayUsedItem.use_date === `${selectedDate}` && (
                <UsedItem
                  id={todayUsedItem.id}
                  name={todayUsedItem.name}
                  price={todayUsedItem.price}
                  type={todayUsedItem.type}
                  setStocks={setStocks}
                />
              )}
          </div>
        ))}
      </ul>
    </>
  );
};
