import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import TopPage from "./components/TopPage";
import { Database } from "@/lib/database.types";
import { cookies } from "next/headers";
import Login from "./components/Login";
import { SnackbarProvider } from "@/providers/context-provider";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <SnackbarProvider>
        <main>
          {/* <Container maxWidth="sm"> */}
          {session ? <TopPage /> : <Login />}
          {/* </Container> */}
        </main>
      </SnackbarProvider>
    </>
  );
}
