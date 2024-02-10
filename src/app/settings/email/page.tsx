import Email from "@/app/components/email"
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
  const { data: { session }} = await supabase.auth.getSession()

  // 未認証の場合、リダイレクト
  if (!session) {
    redirect('/auth/login')
  }

  return (
    <Email email={session.user.email!}/>
  )
}

export default EmailPage
