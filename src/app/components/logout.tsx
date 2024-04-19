'use client'

import { Database } from "@/lib/database.types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import Loading from "@/app/components/Loading"
import { Button, Typography } from "@mui/material"

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
      <Typography sx={{textAlign:"center", mb:2}}>ログアウトしますか？</Typography>
      {/* ログアウトボタン */}
      <form onSubmit={onSubmit}>
        <div>
          {loading ? (<Loading />) : ( <Button variant="outlined" type="submit" sx={{width:"90%", display:"block", marginInline:"auto"}}>ログアウト</Button> )}
        </div>
      </form>
      { message && <div>{message}</div> }
    </div>
  )
}

export default Logout
