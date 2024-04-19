"use client";

import { Database } from "@/lib/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, TextField, Typography } from "@mui/material";
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
  email: z.string().email({ message: "メールアドレスの形式ではありません。" }),
  password: z.string().min(6, { message: "6文字以上入力する必要があります。" }),
});

// ログインページ
const Login = () => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ローディングとメッセージ変数を作成する
  // useFormでフォームの更新状態を管理する
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: { email: "", password: "" },
    // 入力値の検証
    resolver: zodResolver(schema),
  });

  // 送信 dataに入力フォームの値が入る
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true);
    try {
      // ログイン
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      // エラーチェック
      if (error) {
        setMessage("エラーが発生しました。" + error.message);
        return;
      }
    } catch (error) {
      setMessage("エラーが発生しました。" + error);
      return;
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  // const mode = useModeStore((state) => (state.mode));
  // const theme = useMemo(() => colorTheme(mode), [mode]);

  return (
    <div>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
      >
        ログイン
      </Typography>
      <Stack
        component="form"
        noValidate
        spacing={2}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* メールアドレス */}
        <div>
          <TextField
            type="email"
            label="メールアドレス"
            id="email"
            sx={{ width: "100%" }}
            // register関数で入力を登録する
            {...register("email", { required: true })}
          />
        </div>

        {/* パスワード */}
        <div>
          <TextField
            type="password"
            label="パスワード"
            id="password"
            sx={{ width: "100%" }}
            {...register("password", { required: true })}
          />
          <Typography
            variant="body1"
            sx={{ color: "red", textAlign: "center" }}
          >
            {errors.password?.message}
          </Typography>
        </div>

        {/* ログインボタン */}
        <div>
          {loading ? (
            <Loading />
          ) : (
            <Button variant="outlined" type="submit" sx={{ width: "100%" }}>
              ログイン
            </Button>
          )}
        </div>
      </Stack>

      {/* ログインに失敗したときにメッセージを表示 */}
      {message && (
        <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>
          {message}
        </Typography>
      )}

      {/* パスワードを忘れた場合のリンクを作成 */}
      <Stack spacing={2} sx={{ mt: 5 }}>
        <Typography
          variant="body1"
          sx={{ color: "gray", fontWeight: "bold", textAlign: "center" }}
        >
          <Link href="/auth/reset-password">パスワードを忘れた方はこちら</Link>
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "gray", fontWeight: "bold", textAlign: "center" }}
        >
          <Link href="/auth/sign-up">アカウントを作成する</Link>
        </Typography>
      </Stack>
    </div>
  );
};

export default Login;
