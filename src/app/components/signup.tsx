"use client";

import { Database } from "@/lib/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Schema, z } from "zod";
import Loading from "./loading";
import Link from "next/link";

// 入力データの検証ルールを定義
const schema = z.object({
  name: z.string().min(2, { message: "2文字以上入力する必要があります。" }),
  email: z.string().email({ message: "メールアドレスの形式ではありません。" }),
  password: z.string().min(6, { message: "6文字以上入力する必要があります。" }),
});

// ユーザー登録ページ
const Signup = () => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    // 初期値
    defaultValues: { name: "", email: "", password: "" },
    // 入力値の検証
    resolver: zodResolver(schema),
  });

  // 送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true);

    try {
      // サインアップ
      const { error: errorSignup } = await supabase.auth.signup({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (errorSignup) {
        setMessage("エラーが発生しました。" + errorSignup.message);
        return;
      }

      // プロフィールの名前を更新
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ name: data.name })
        .eq("email", data.email);

      // エラーチェック
      if (updateError) {
        setMessage("エラーが発生しました。" + updateError.message);
        return;
      }

      // 入力フォームクリア
      reset();
      setMessage(
        "本登録用のURLを記載したメールを送信しました。メールをご確認の上、メール本文中のURLをクリックして、本登録を行ってください。"
      );
    } catch (error) {
      setMessage("エラーが発生しました。" + error);
      return;
    } finally {
      setLoading(false);
      router.refresh();
    }
  };
  return (
    <div>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
      >
        ユーザー登録
      </Typography>

      <Stack
        component="form"
        noValidate
        spacing={1}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 名前 */}
        <TextField
          label="名前"
          type="text"
          id="name"
          sx={{ width: "100%" }}
          {...register("name", { required: true })}
          required
        />
        <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>
          {errors.name?.message}
        </Typography>

        {/* メールアドレス */}
        <TextField
          type="email"
          label="新しいメールアドレス"
          sx={{ width: "100%" }}
          {...register("email", { required: true })}
        />
        <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>
          {errors.email?.message}
        </Typography>

        {/* パスワード */}
        <TextField
          type="password"
          label="パスワード"
          id="password"
          sx={{ width: "100%" }}
          {...register("password", { required: true })}
        />
        <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>
          {errors.password?.message}
        </Typography>

        {/* 登録ボタン */}
        <div>
          {loading ? (
            <Loading />
          ) : (
            <Button variant="outlined" type="submit">
              登録
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
        <Link href="/auth/login">ログインはこちら</Link>
      </Stack>
    </div>
  );
};

export default Signup;
