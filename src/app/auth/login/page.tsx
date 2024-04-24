// ログインページ
import Login from "@/app/components/Login"
import { Database } from "@/lib/database.types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const LoginPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // セッションの取得
  const { data: { user },} = await supabase.auth.getUser()

  // 認証している場合、リダイレクト
  if (user) {
    redirect('/')
  }

  return (
    <div className="mx-3 mt-6">
      <Login />
    </div>
  )
}

export default LoginPage
