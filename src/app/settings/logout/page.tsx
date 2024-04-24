import Logout from "@/app/components/Logout"
import { Database } from "@/lib/database.types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"


const LogoutPage = async() => {
  const supabase = createServerComponentClient<Database>({
    cookies
  })

  // セッションの取得
  const { data:{ user}} = await supabase.auth.getUser()

  // 未認証の場合、リダイレクト
  if (!user) {
    redirect('/auth/login')
  }
  return <Logout />
}

export default LogoutPage
