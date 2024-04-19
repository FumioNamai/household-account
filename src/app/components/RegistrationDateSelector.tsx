import { InputLabel } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

type Props = {
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
};

const RegistrationDateSelector = ({date, setDate}:Props) => {
  return (
    <>
      <InputLabel>購入日</InputLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{ maxWidth: "238px", marginBottom: "12px" }}
          value={date}
          format="YYYY/MM/DD"
          onChange={setDate}
        />
      </LocalizationProvider>
    </>
  );
};

export default RegistrationDateSelector;
