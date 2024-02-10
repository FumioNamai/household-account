"use client";

import { Session } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import Link from "next/link";
import { useEffect } from "react";
import useStore from "@/store/index";
import { dividerClasses } from "@mui/material";

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
      avatar_url: session && profile ? profile.avatar_url : "",
    });
  }, [session, setUser, profile]);

  return (
    <header>
      <div>
        <Link href="/">Auth Component</Link>
        <div>
          {session ? (
            <div>
              <Link href="/settings/profile">
                <div>{profile && profile.name}</div>
              </Link>
            </div>
          ) : (
            <div>
              <Link href="/auth/login">ログイン</Link>
              {/* <Link href="/auth/signup">サインアップ</Link> */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
