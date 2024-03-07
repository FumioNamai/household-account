"use client";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { usePathname } from "next/navigation";
import {
  Box,
  Container,
  Link,
  PaletteMode,
  Stack,
  createTheme,
} from "@mui/material";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { useMemo, useState } from "react";
import { useModeStore } from "@/store";
import ModeSwitch from "../components/modeSwitch";
import { colorTheme } from "../components/colorTheme";

// セッティングス用のナビゲーション
const subNavigation = [
  {
    name: "プロフィール",
    icon: AccountCircleOutlinedIcon,
    href: "/settings/profile",
  },
  {
    name: "メールアドレス",
    icon: EmailOutlinedIcon,
    href: "/settings/email",
  },
  {
    name: "パスワード",
    icon: PasswordOutlinedIcon,
    href: "/settings/password",
  },
  {
    name: "ログアウト",
    icon: LogoutOutlinedIcon,
    href: "/settings/logout",
  },
];

//レイアウト
const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // 現在のページのパスを取得できる
  const { mode, } = useModeStore()
  const theme = useMemo(() =>
  createTheme({
    palette: {
      mode: mode as PaletteMode,
    },
  }),
  [mode]
  )

  return (
      <Container maxWidth="sm">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ModeSwitch />
          <Stack spacing={1}>
            {subNavigation.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                underline="none"
                sx={{ color: "black" }}
              >
                <div
                  className={`flex flex-row items-center text-xl mx-8 py-3 ${
                    item.href == pathname &&
                    "bg-sky-100 text-sky-500 hover:bg-sky-100 mx-3 px-5 rounded-full "
                  }`}
                >
                  <item.icon className=" inline-block mr-2 "></item.icon>
                  {item.name}
                </div>
              </Link>
            ))}
            <Link href="/" underline="hover">
              <div className="flex justify-end item-center text-md py-3 px-4">
                トップページへ戻る
              </div>
            </Link>
          </Stack>
          <Box sx={{ marginTop: 5, marginInline: 2 }}>{children}</Box>
        </ThemeProvider>
      </Container>
  );
};

export default SettingsLayout;
