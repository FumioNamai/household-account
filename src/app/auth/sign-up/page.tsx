import SignUp from "@/app/components/SignUp";
import { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ユーザー登録ページ
const SignUpPage = async () => {
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
    <div className="mx-3 mt-6">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
