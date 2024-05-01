import { useDateStore } from "@/store";
import { InputLabel } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// type Props = {
//   date: Dayjs | null;
//   setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
// };

const RegistrationDateSelector = () => {
  const {date,setDate} = useDateStore()
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
