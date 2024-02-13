import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import TopPage from "./components/TopPage";
import { Database } from "@/lib/database.types";
import { cookies } from 'next/headers'
import { Box, Container, Typography } from "@mui/material";
import Login from "./components/login";

export default async function Home() {

  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const { data: {session},} = await supabase.auth.getSession()

  return (
    <Container maxWidth="sm">
        { session ? <TopPage session={session} /> : <Login />}
    </Container>
  );
}
