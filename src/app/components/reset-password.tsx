"use client"

import { Database } from "@/lib/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod"
import Loading from "./loading";

type Schema = z.infer<typeof schema>;

// 入力データの検証ルールを定義
const schema = z.object({
  email: z.string().email({ message: "メールアドレスの形式ではありません。"})
})

// パスワードリセットページ
const ResetPassword = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    // 初期値
    defaultValues: { email: ""},
    // 入力値の検証
    resolver: zodResolver(schema),
  })

  // 送信
  const onSubmit: SubmitHandler<Schema> = async(data) => {
    setLoading(true)
    setMessage("")

    try {
      // パスワードリセットメールを送信
      const { error } = await supabase.auth.resetPasswordForEmail(
        data.email, {
          redirectTo: `${location.origin}/auth/reset-password/confirm`
        })

      // エラーチェック
      if (error) {
        setMessage("エラーが発生しました。" + error.message)
        return
      }
      reset()
      setMessage("パスワードは正常に更新されました。")
    } catch (error) {
      setMessage("エラーが発生しました。" + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }


  return (
    <div>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
      >
        パスワードを忘れた場合
      </Typography>

      <Stack
        component="form"
        noValidate
        spacing={1}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 現在のメールアドレス */}
        {/* <Box sx={{ mb:2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            現在のメールアドレス
          </Typography>
          <Typography variant="body1">{email}</Typography>
        </Box> */}

        {/*メールアドレス */}
        <TextField
          type="email"
          label="メールアドレス"
          sx={{ width: "100%" }}
          {...register("email", { required: true })}
        />
        <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>
          {errors.email?.message}
        </Typography>

        {/* 送信ボタン */}
        <div>
          {loading ? (
            <Loading />
          ) : (
            <Button variant="outlined" type="submit" sx={{width:"100%"}}>
              送信
            </Button>
          )}
        </div>
        {/* メッセージ */}
        {message && (
          <Typography
            variant="body1"
            sx={{ color: "red", textAlign: "center" }}
          >
            {message}
          </Typography>
        )}

      </Stack>
    </div>
  );
}

export default ResetPassword
