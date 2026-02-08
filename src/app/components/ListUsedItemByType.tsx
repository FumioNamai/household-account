import { List, Typography } from "@mui/material";
import UsedItem from "./UsedItem";
import { Stock } from "../../../utils/type";
import { useDateStore } from "@/store";

type Props = {
  typeName : string;
  todayUsedItems : Stock[];
};

export const ListUsedItemByType = ({
  typeName,
  todayUsedItems
}: Props) => {
  const {selectedDate} = useDateStore()
  return (
    <>
      <Typography variant="subtitle1">{typeName}</Typography>
      <List>
        {todayUsedItems.map((todayUsedItem: Stock) => (
          <div key={todayUsedItem.id}>
            {todayUsedItem.type === `${typeName}` &&
              todayUsedItem.use_date === `${selectedDate()}` && (
                <UsedItem
                  id={todayUsedItem.id}
                  name={todayUsedItem.name}
                  price={todayUsedItem.price}
                  type={todayUsedItem.type}
                />
              )}
          </div>
        ))}
      </List>
    </>
  );
};
