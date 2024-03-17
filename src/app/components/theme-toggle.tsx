"use client";

import {
  Box,
  Button,
  // Skeleton,
  // MenuItem,
  // Select,
  // SelectChangeEvent,
  Typography,
} from "@mui/material";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";

import { useTheme } from "next-themes";

import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true)
  // const [mode, setMode] = useState("light")
  // console.log("useTheme", useTheme());
  // console.log("mounted", mounted);
  // console.log("theme", theme);

  // const mode = localStorage.getItem("theme")
  // console.log("mode",mode);

  useEffect(() => {
    if (mounted === false) {
      setIsLoading(true)
      console.log("ローディング中");
    } else {
      setIsLoading(false)
      console.log("ローディング終了");
    }
  },[mounted])

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
    <>

    {
      isLoading ?
      "ローディング中"
      :

    <Box
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        marginInline: "auto",
        height: "40px",
        marginBottom: "10px",
      }}
    >
      {/* 現在のテーマ{theme} */}
      {/* <select
        value={theme}
        onChange={(e) => setTheme(e.target.value) }
        >
        <option value="system">システム</option>
        <option value="dark">ダーク</option>
        <option value="light">ライト</option>
      </select> */}

      <Button
        size="small"
        onClick={() => {
          setTheme("light");
        }}
      >
        <LightModeRoundedIcon sx={{ margin: "10px" }} />
        Light
      </Button>
      <Button
        size="small"
        onClick={() => {
          setTheme("dark");
        }}
      >
        <NightlightRoundedIcon sx={{ margin: "10px" }} />
        Dark
      </Button>
      <Button
        size="small"
        onClick={() => {
          setTheme("system");
        }}
      >
        <DesktopWindowsRoundedIcon sx={{ margin: "10px" }} />
        System
      </Button>
    </Box>
  }
  </>
  );
};
