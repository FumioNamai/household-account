// ログインページ
import Login from "@/app/components/Login";
import { Database } from "@/lib/database.types";
import { Box } from "@mui/material";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  // セッションの取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 認証している場合、リダイレクト
  if (user) {
    redirect("/");
  }

  return (
    <Box
      sx={{
        mx: 1.5,
        mt: 3,
      }}
    >
      <Login />
    </Box>
  );
};

export default LoginPage;
