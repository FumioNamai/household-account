'use client'

import { Database } from "@/lib/database.types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import Loading from "./loading"

const Logout = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // 送信
  const onSubmit = async(e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // ログアウト
      const { error } = await supabase.auth.signOut()

      //エラーチェック
      if(error) {
        setMessage('エラーが発生しました。' + error.message)
        return
      }
      router.push('/')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return

    } finally {
      setLoading(false)
      router.refresh()
    }
  }
  return (
    <div>
      <div>ログアウトしますか？</div>
      {/* ログアウトボタン */}
      <form onSubmit={onSubmit}>
        <div>
          {loading ? (<Loading />) : ( <button type="submit">ログアウト</button> )}
        </div>
      </form>
      { message && <div>{message}</div> }
    </div>
  )
}

export default Logout
