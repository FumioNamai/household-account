
import { Database } from "@/lib/database.types";
import { Container } from "@mui/material";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import TopPage from "@/app/components/TopPage";
import Login from "../components/Login";

export default async function Selector() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <Container maxWidth="sm">{user ? <TopPage /> : <Login />}</Container>
  );
}
