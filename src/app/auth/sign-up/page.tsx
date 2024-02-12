

import SignUp from "@/app/components/sign-up"
import { Database } from "@/lib/database.types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"


// ユーザー登録ページ
const SignUpPage = async() => {
  const supabase = createServerComponentClient<Database>({
    cookies
  })

  // セッションの取得
  const { data: { session }} = await supabase.auth.getSession()

  // 認証している場合、リダイレクト
  if (session) {
    redirect('/')
  }
  return <SignUp />
}

export default SignUpPage