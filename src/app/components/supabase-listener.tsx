"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "../../lib/database.types"
import { cookies } from 'next/headers'

// 認証状態の監視
const SupabaseListener = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  // セッション情報を取得してナビゲーションに渡す
  const { data: { session },} = await supabase.auth.getSession()

  // プロフィール情報を取得する
  let profile = null

  if (session) {
    const { data: currentProfile } = await supabase.from('profiles').select('*').eq('id',session.user.id).single()

    profile = currentProfile

    // メールアドレスを変更した場合は、プロフィール情報を更新する
    if ( currentProfile && currentProfile.email !== session?.user.email ) {
      const { data:updatedProfiles } = await supabase.from('profiles').update({email:session.user.email}).match( {
        id:session.user.id
      }).select('*').single()
      profile = updatedProfiles
    }
  }
  // return(
    // <Navigation />
  // )
}

export default SupabaseListener
