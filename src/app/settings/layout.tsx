"use client";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { usePathname } from "next/navigation";
import { Box, Container, Link, Stack } from "@mui/material";
import NextLink from "next/link";

// セッティングス用のナビゲーション
const subNavigation = [
  {
    name: "ユーザー名",
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

  return (
    <>
      <Stack spacing={1}>
        {subNavigation.map((item, index) => {
          const isActive = item.href === pathname;

          return (
            <Link
              key={index}
              component={NextLink}
              href={item.href}
              underline="none"
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  fontSize: "1.25rem",
                  mx: 4,
                  py: 1.5,
                  px: 2.5,
                  borderRadius: "9999px",
                  bgcolor: isActive ? "#e0f2fe" : "transparent",
                  // sky-100
                  color: "#1976d2",
                  // sky-500
                  "&:hover": {
                    bgcolor: isActive ? "#e0f2fe" : "action.hover",
                  },
                }}
              >
                <Box
                  component={item.icon}
                  sx={{
                    display: "inline-block",
                    mr: 1,
                  }}
                />
                {item.name}
              </Box>
            </Link>
          );
        })}

        {/* <Link
          component={NextLink}
          href="/"
          underline="hover"
        > */}
        <Box
          sx={{
            py: 1.5,
            px: 2,
          }}
        >
          <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
            }}
          >
            <Link
              href="/"
              sx={{
                fontSize: "1rem",
                color: "#1976d2",
              }}
            >
              トップページへ戻る
            </Link>
          </Box>
        </Box>
        {/* </Link> */}
      </Stack>

      <Box sx={{ mt: 5, mx: 2 }}>{children}</Box>
    </>
  );
};

export default SettingsLayout;
