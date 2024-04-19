import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database.types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  //supabaseクライアントを作成する
  const supabase = createMiddlewareClient<Database>({
    req,
    res,
  });
  //セッション情報を取得する⇒認証状態をチェックできるようになる
  await supabase.auth.getSession();
  return res;
}
