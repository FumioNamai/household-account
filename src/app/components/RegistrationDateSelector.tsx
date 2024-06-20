import { useDateStore } from "@/store";
import { InputLabel } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const RegistrationDateSelector = () => {
  const { date, setDate } = useDateStore();
  return (
    <>
      <InputLabel>購入日</InputLabel>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="ja"
        dateFormats={{ monthAndYear: "YYYY年 MM月", year: "YYYY年" }}
        localeText={{
          previousMonth: "前月を表示",
          nextMonth: "次月を表示",
          cancelButtonLabel: "キャンセル",
          okButtonLabel: "選択",
        }}
      >
        <DatePicker
          sx={{ maxWidth: "238px", marginBottom: "12px" }}
          value={date}
          maxDate={dayjs().add(1,"M")}
          minDate={dayjs("2023-01-01")}
          format="YYYY年MM月DD日"
          slotProps={{
            toolbar:{hidden:true}
          }}
          onChange={setDate}
        />
      </LocalizationProvider>
    </>
  );
};

export default RegistrationDateSelector;
