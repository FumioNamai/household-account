import ResetPassword from "@/app/components/ResetPassword"
import { Database } from "@/lib/database.types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Box } from "@mui/material"

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
    <Box
      sx={{
        mx: 1.5,
        mt: 3,
      }}
    >
      <ResetPassword />
    </Box>
  )
}

export default ResetPasswordPage
