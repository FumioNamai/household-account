import ResetPassword from "@/app/components/reset-password"
import { Database } from "@/lib/database.types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

// パスワードリセットページ
const ResetPasswordPage = async() => {
  const supabase = createServerComponentClient<Database> ({
    cookies
  })

  // セッションの取得
  const { data: { session }} = await supabase.auth.getSession()

  // 認証している場合、リダイレクト
  if (session) {
    redirect('/')
  }

  return <ResetPassword />
}

export default ResetPasswordPage