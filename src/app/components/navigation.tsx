"use client";

import { Session } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
// import Link from "next/link";
import { useEffect } from "react";
import useStore from "@/store/index";
import { Box, Stack,Link, Typography} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';

type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];
const Navigation = ({
  session,
  profile,
}: {
  session: Session | null;
  profile: ProfileType | null;
}) => {
  const { setUser } = useStore();

  // 状態管理にユーザー情報を保存
  // セッションが無い場合は状態管理も空になる

  useEffect(() => {
    setUser({
      id: session ? session.user.id : "",
      email: session ? session.user.email : "",
      name: session && profile ? profile.name : "",
      introduce: session && profile ? profile.introduce : "",
      // avatar_url: session && profile ? profile.avatar_url : "",
    });
  }, [session, setUser, profile]);

  return (
    <>
      { session ? (
        <Box sx={{ display:"flex", flexDirection:"row", gap:2,alignItems:"center"}}>
            {profile &&
            <>
            <Typography variant="body1" sx={{ fontSize: 18}}>ユーザー：{profile.name}さん</Typography>
            <Link underline="hover" href="/settings/profile">
              <SettingsIcon sx={{width:"30px", height:"30px"}}/>
            </Link>
            </>
            }
        </Box>
      ) : (
        <>
        <Box sx={{ display:"flex", flexDirection:"row", gap:2,alignItems:"center"}}>
          <Link href="/auth/login" underline="hover">ログイン</Link>
          <Link href="/auth/sign-up" underline="hover">ユーザー登録</Link>
        </Box>
        </>
      )}
    </>
  );
};

export default Navigation;
