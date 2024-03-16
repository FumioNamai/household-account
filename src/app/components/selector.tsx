
import { Database } from "@/lib/database.types";
import { Container } from "@mui/material";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import TopPage from "./TopPage";
import Login from "./login";


export default async function Selector() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <Container maxWidth="sm">{session ? <TopPage /> : <Login />}</Container>
  );
}