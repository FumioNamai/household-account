"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "../../lib/database.types"
import { cookies } from 'next/headers'
import Navigation from "@/app/components/Navigation"

// 認証状態の監視
const SupabaseListener = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  // ユーザー情報を取得してナビゲーションに渡す
  const { data: { user },} = await supabase.auth.getUser()

  // プロフィール情報を取得する
  let profile = null

  if (user) {
    const { data: currentProfile } = await supabase.from('profiles').select('*').eq('id',user.id).single()

    profile = currentProfile

    // メールアドレスを変更した場合は、プロフィール情報を更新する
    if ( currentProfile && currentProfile.email !== user.email ) {
      const { data:updatedProfiles } = await supabase.from('profiles').update({email:user.email}).match( {
        id:user.id
      }).select('*').single()

      profile = updatedProfiles
    }
  }
  return(
    <Navigation user={user} profile={profile}/>
  )
}

export default SupabaseListener
