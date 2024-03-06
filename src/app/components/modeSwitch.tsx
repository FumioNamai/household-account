import { useModeStore } from "@/store";
import {
  Box,
  Button, createTheme,
} from "@mui/material";
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import NightlightRoundedIcon from '@mui/icons-material/NightlightRounded';
import { grey } from "@mui/material/colors";

const ModeSwitch = () => {
  const { mode, setMode } = useModeStore();
  const toggleColorMode = () => {
    setMode();
  };

  // const theme = createTheme({
  //   palette: {
  //     ...(mode === true ? {
  //       text: {
  //         primary: grey[900],
  //         secondary: grey[800],
  //       },
  //       background: {
  //         paper: grey[100],
  //         default: grey[100],
  //       }
  //     } : {
  //       divider:grey[700],
  //       text: {
  //         primary: grey[100],
  //         secondary: grey[200],
  //       },
  //       background: {
  //         paper: grey[900],
  //         default: grey[900],
  //       },
  //       action: {
  //         active: grey[200],
  //       }
  //     })
  //   },
  // })

  return (

    <Button
    sx={{padding:0, minWidth:"24px", marginBlock:"12px",}}
    onClick={toggleColorMode}
    >{mode === false ? <LightModeRoundedIcon /> : <NightlightRoundedIcon /> }
    </Button>

  );
};

export default ModeSwitch;
