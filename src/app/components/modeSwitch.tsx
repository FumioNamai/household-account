import { useModeStore } from "@/store";
import {
  Button
} from "@mui/material";
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import NightlightRoundedIcon from '@mui/icons-material/NightlightRounded'

const ModeSwitch = () => {
  const mode = useModeStore((state) => (state.mode));
  const toggleColorMode = useModeStore((state) => (state.toggleColorMode));
  // const { mode, toggleColorMode} = useModeStore();

  return (
    <Button
    sx={{padding:0, minWidth:"24px", marginBlock:"12px",}}
    onClick={toggleColorMode}
    >{mode === "dark" ? <LightModeRoundedIcon /> : <NightlightRoundedIcon /> }
    </Button>
  );
};

export default ModeSwitch;
