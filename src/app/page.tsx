import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import TopPage from "./components/TopPage";
import { Database } from "@/lib/database.types";
import { cookies } from "next/headers";
import Login from "./components/Login";
import { SnackbarProvider } from "@/providers/context-provider";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <SnackbarProvider>
        <main>
          {/* <Container maxWidth="sm"> */}
          {user ? <TopPage /> : <Login />}
          {/* </Container> */}
        </main>
      </SnackbarProvider>
    </>
  );
}
