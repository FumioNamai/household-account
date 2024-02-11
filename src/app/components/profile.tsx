"use client";

import { Database } from "@/lib/database.types";
import useStore from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "./loading";
import { Box, Stack, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
type Schema = z.infer<typeof schema>;

// 入力データの検証ルールを定義する
const schema = z.object({
  name: z.string().min(2, { message: "2文字以上入力する必要があります。" }),
  introduce: z.string().min(0),
});

const Profile = () => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fileMessage, setFileMessage] = useState("");
  const { user } = useStore();

  // フォームの状態管理
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: {
      name: user.name ? user.name : "",
      introduce: user.introduce ? user.introduce : "",
    },
    // 入力値の検証
    resolver: zodResolver(schema),
  });

  // 送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      // プロフィールアップデート
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: data.name,
          introduce: data.introduce,
        })
        .eq("id", user.id);

      // エラーチェック
      if (updateError) {
        setMessage("エラーが発生しました。" + updateError.message);
        return;
      }

      setMessage("プロフィールを更新しました。");
    } catch (error) {
      setMessage("エラーが発生しました。" + error);
      return;
    } finally {
      setLoading(false);
      router.refresh();
    }
  };
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          width: "100%",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 24,
          mb: 3,
        }}
      >
        プロフィール
      </Typography>

      <Stack
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      spacing={2}
      sx={{mb:5}}>
        {/* アバター画像 */}
        {/* 名前 */}
        <TextField
          label="名前"
          type="text"
          id="name"
          sx={{ width: "100%" }}
          {...register("name", { required: true })}
          required
        />
        <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>{errors.name?.message}</Typography>

        {/* 自己紹介 */}
        <TextField
          label="自己紹介"
          multiline
          id="introduce"
          rows={5}
          sx={{ width: "100%" }}
          {...register("introduce")}
        />

        {/* 変更ボタン */}
        <Box>
          {loading ? (
            <Loading />
          ) : (
            <Button variant="outlined" type="submit" sx={{width:"100%"}}>
              変更
            </Button>
          )}
        </Box>
      </Stack>
      {message && (
        <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Profile;
