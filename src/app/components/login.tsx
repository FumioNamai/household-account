"use client";

import { Database } from "@/lib/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, dividerClasses } from "@mui/material";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "./loading";
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
  return (
    <div>
      <div className=" text-center font-bold text-xl mb-10">ログイン</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* メールアドレス */}
        <div>
          <input
            type="email"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="メールアドレス"
            id="email"
            // register関数で入力を登録する
            {...register("email", { required: true })}
          />
        </div>

        {/* パスワード */}
        <div>
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="パスワード"
            id="password"
            {...register("password", { required: true })}
          />
          <div>{errors.password?.message}</div>
        </div>

        {/* ログインボタン */}
        <div>
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
            >
              ログイン
            </button>
          )}
        </div>
      </form>

      {/* ログインに失敗したときにメッセージを表示 */}
      {message && <div>{message}</div>}

      {/* パスワードを忘れた場合のリンクを作成 */}
      <div>
        <Link href='/auth/reset-password'>パスワードを忘れた方はこちら</Link>
      </div>
      <div>
        <Link href='/auth/signup'>アカウントを作成する</Link>
      </div>
    </div>
  );
};

export default Login;
