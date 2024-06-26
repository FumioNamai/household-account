import Email from "@/app/components/Email"
import { Database } from "@/lib/database.types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"


// メールアドレス変更ページ
const EmailPage = async() => {
  const supabase = createServerComponentClient<Database>({
    cookies
  })

  // セッションの取得
  const { data: { user }} = await supabase.auth.getUser()

  // 未認証の場合、リダイレクト
  if (!user) {
    redirect('/auth/login')
  }

  return (
    <Email email={user.email!}/>
  )
}

export default EmailPage
