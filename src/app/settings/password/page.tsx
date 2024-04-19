import Password from "@/app/components/password"
import { Database } from "@/lib/database.types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"


// パスワード変更ページ
const PasswordPage = async() => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // セッションの取得
  const { data: { session }} = await supabase.auth.getSession()

  // 未認証の場合、リダイレクト
  if(!session) {
    redirect('/auth/login')
  }

  return(
    <Password />
  )
}

export default PasswordPage
