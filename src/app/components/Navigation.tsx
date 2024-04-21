"use client";

import { Session } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import { useEffect } from "react";
import useStore from "@/store/index";
import { Box, Stack, Link, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];
const Navigation = ({
  session,
  profile,
}: {
  session: Session | null;
  profile: ProfileType | null;
}) => {
  const setUser = useStore((state) => state.setUser);
  // 状態管理にユーザー情報を保存
  // セッションが無い場合は状態管理も空になる
  useEffect(() => {
    setUser({
      email: session ? session.user.email : "",
      id: session ? session.user.id : "",
      introduce: session && profile ? profile.introduce : "",
      name: session && profile ? profile.name : "",
      // avatar_url: session && profile ? profile.avatar_url : "",
    });
  }, [session, setUser, profile]);

  return (
    <>
      {session ? (
        <Stack direction="row" alignItems="center" spacing={1}>
          {profile && (
            <>
              <Typography variant="body1" sx={{ fontSize: 16 }}>
                {profile.name}さん
              </Typography>
              <Link underline="hover" href="/settings/profile">
                <SettingsIcon sx={{ width: "30px", height: "30px" }} />
              </Link>
            </>
          )}
        </Stack>
      ) : (
        <>
          <Stack direction="row" spacing={2}>
            <Link href="/auth/login" underline="hover">
              ログイン
            </Link>
            <Link href="/auth/sign-up" underline="hover">
              ユーザー登録
            </Link>
          </Stack>
        </>
      )}
    </>
  );
};

export default Navigation;
