"use client";

import { Button, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useTheme } from "next-themes";

import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme , setTheme } = useTheme();


    // const [mode, setMode] = useState("light")
  // console.log("useTheme",useTheme());
  // console.log("mounted", mounted);
  // console.log("theme", theme);

  // const mode = localStorage.getItem("theme")
  // console.log("mode",mode);


  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }


// const handleChange = (event) => {
//   setTheme(event.target.value);
// }

  // const theme = useMemo(() => colorTheme(mode), [mode]);
  return (
    <div>
      <div>現在のテーマ{theme}</div>
      {/* <select
        value={theme}
        onChange={(e) => setTheme(e.target.value) }
      >
        <option value="system">システム</option>
        <option value="dark">ダーク</option>
        <option value="light">ライト</option>
      </select> */}

      <Button
      onClick={()=> {setTheme("light")}}
      >
        light
      </Button>
      <Button
      onClick={()=> {setTheme("dark")}}
      >
        dark
      </Button>
      {/* <Button
      onClick={()=> {setTheme("system")}}
      >
        system
      </Button> */}
    </div>
  );
};
