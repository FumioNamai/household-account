import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import TopPage from "./components/TopPage";
import { Database } from "@/lib/database.types";
import { cookies } from 'next/headers'
import { Box } from "@mui/material";

export default async function Home() {

  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const { data: {session},} = await supabase.auth.getSession()

  return (
    <>
        { session ? <TopPage /> : <div>未ログイン</div>}
    </>
  );
}
