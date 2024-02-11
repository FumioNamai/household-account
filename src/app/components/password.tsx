"use client";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Schema, z } from "zod";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// 入力データの検証ルールを定義
const schema = z
  .object({
    password: z
      .string()
      .min(6, { message: "6文字以上入力する必要があります。" }),
    confirmation: z
      .string()
      .min(6, { message: "6文字以上入力する必要があります。" }),
  })
  .refine((data) => data.password === data.confirmation, {
    message: "新しいパスワードと確認用パスワードが一致しません。",
    path: ["confirmation"], // エラーメッセージが適用されるフィールド
  });

// パスワード変更
const Password = () => {
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
    defaultValues: { password: "", confirmation:""},
    // 入力値
    resolver: zodResolver(schema),
  })

  // 送信
  const onSubmit: SubmitHandler<Schema> = async(data) => {
    setLoading(true)
    setMessage("")

    try {
      //パスワードの更新
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })
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
        パスワード変更
      </Typography>

      <Stack
        component="form"
        noValidate
        spacing={1}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 新しいパスワード */}
        <TextField
          type="password"
          label="新しいパスワード"
          id="password"
          sx={{ width: "100%" }}
          {...register("password", { required: true })}
        />
        <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>
          {errors.password?.message}
        </Typography>

        {/* 確認用パスワード */}
        <TextField
          type="password"
          label="確認用パスワード"
          id="confirmation"
          sx={{ width: "100%" }}
          {...register("confirmation", { required: true })}
        />
        <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>
          {errors.password?.message}
        </Typography>

        {/* 変更ボタン */}
        <div>
          {loading ? (
            <Loading />
          ) : (
            <Button variant="outlined" type="submit">
              変更
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
};

export default Password;
