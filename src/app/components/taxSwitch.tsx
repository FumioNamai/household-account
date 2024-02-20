import { useTaxStore } from "@/store";
import { FormControl, Stack, Switch, Typography } from "@mui/material"

const TaxSwitch = () => {
  const { tax, setTax } = useTaxStore();
  const handleTax = () => {
    setTax()
  }

  return (
    <FormControl>
    <Stack direction="row" alignItems="center">
    <Typography>税抜</Typography>
    <Switch checked={tax} onChange={handleTax} />
    <Typography>税込</Typography>
    </Stack>
  </FormControl>
  )
}


export default TaxSwitch
