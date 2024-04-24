import ResetPassword from "@/app/components/ResetPassword"
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
  const { data: { user }} = await supabase.auth.getUser()

  // 認証している場合、リダイレクト
  if (user) {
    redirect('/')
  }

  return (
    <div className="mx-3 mt-6">
      <ResetPassword />
    </div>
  )
}

export default ResetPasswordPage
