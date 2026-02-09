"use client";

import { Database } from "@/lib/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "@/app/components/Loading";
import Link from "next/link";

type Schema = z.infer<typeof schema>;

// 入力データの検証ルールを定義
const schema = z.object({
  name: z.string().min(2, { message: "2文字以上入力する必要があります。" }),
  email: z.string().email({ message: "メールアドレスの形式ではありません。" }),
  password: z.string().min(6, { message: "6文字以上入力する必要があります。" }),
});

// ユーザー登録ページ
const SignUp = () => {
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
      const { error: errorSignUp } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (errorSignUp) {
        setMessage("エラーが発生しました。" + errorSignUp.message);
        return;
      }

      // プロフィールの名前を更新
      const { error: updateError } = await (supabase.from("profiles") as any)
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
        "本登録用のURLを記載したメールを送信しました。メールをご確認の上、メール本文中のURLをクリックして、本登録を行ってください。",
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
        sx={{ fontWeight: "bold", textAlign: "center", mb: 3, mt: 3 }}
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
          label="ユーザー名"
          type="text"
          id="name"
          sx={{ width: "100%" }}
          {...register("name", { required: true })}
        />
        <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>
          {errors.name?.message}
        </Typography>

        {/* メールアドレス */}
        <TextField
          type="email"
          label="メールアドレスを登録"
          sx={{ width: "100%" }}
          {...register("email", { required: true })}
        />
        <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>
          {errors.email?.message}
        </Typography>

        {/* パスワード */}
        <TextField
          type="password"
          label="パスワードを設定（半角英数字や記号を使い、6文字以上）"
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
            <Button variant="outlined" type="submit" sx={{ width: "100%" }}>
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
      </Stack>
      <Box sx={{ mt: 5 }}>
        <Typography
          variant="body1"
          sx={{ color: "gray", fontWeight: "bold", textAlign: "center" }}
        >
          <Link href="/auth/login">ログインはこちら</Link>
        </Typography>
      </Box>
    </div>
  );
};

export default SignUp;
