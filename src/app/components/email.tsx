"use client";

import { Database } from "@/lib/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "./loading";

type Schema = z.infer<typeof schema>;

// 入力データの検証ルールを定義
const schema = z.object({
  email: z.string().email({ message: "メールアドレスの形式ではありません。" }),
});

// メールアドレス変更
const Email = ({ email }: { email: string }) => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: { email: "" },
    // 入力値の検証
    resolver: zodResolver(schema),
  });

  // 送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      // メールアドレス変更メールを送信
      const { error: updateUserError } = await supabase.auth.updateUser(
        { email: data.email },
        { emailRedirectTo: `${location.origin}/auth/login` }
      );
      // エラーチェック
      if (updateUserError) {
        setMessage("エラーが発生しました。" + updateUserError.message);
        return;
      }
      setMessage("確認用のURLを記載したメールを送信しました。");
      // ログアウト
      const { error: signOutError } = await supabase.auth.signOut();
      // エラーチェック
      if (signOutError) {
        setMessage("エラーが発生しました。" + signOutError.message);
        return;
      }
      router.push("/auth/login");
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
        sx={{ fontWeight: "bold", textAlign: "center", marginBottom: "40px" }}
      >
        メールアドレス変更
      </Typography>
      <Stack
        component="form"
        noValidate
        spacing={2}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 現在のメールアドレス */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            現在のメールアドレス
          </Typography>
          <Typography variant="body1">{email}</Typography>
        </Box>

        {/* 新しいメールアドレス */}
        <TextField
          type="email"
          label="新しいメールアドレス"
          sx={{ width: "100%" }}
          {...register("email", { required: true })}
        />
        <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>
          {errors.email?.message}
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

export default Email;
