"use client";

import {
  Box,
  Button,
} from "@mui/material";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";

import { useTheme } from "next-themes";

import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // console.log("useTheme", useTheme());
  // console.log("mounted", mounted);
  // console.log("theme", theme);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <>
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
    </>
  );
};
