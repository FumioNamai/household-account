import { useTaxStore } from "@/store";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";

const TaxSwitch = () => {
  const { tax, setTax } = useTaxStore();
  const handleTax = () => {
    setTax();
  };

  return (
    <FormControl>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={tax} onChange={handleTax} />}
          label={tax ? "税込" : "税抜"}
          sx={{marginRight:"0"}}
        />
      </FormGroup>
    </FormControl>
  );
};

export default TaxSwitch;
