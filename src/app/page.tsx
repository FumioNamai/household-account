import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import TopPage from "./components/TopPage";
import { Database } from "@/lib/database.types";
import { cookies } from "next/headers";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import Login from "./components/login";
import { SnackbarProvider } from "@/providers/context-provider";
import Header from "./components/header";
import { useModeStore } from "@/store";
import { useMemo } from "react";
import { colorTheme } from "./components/colorTheme";
import ModeSwitch from "./components/modeSwitch";

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
          <Container maxWidth="sm">
            {session ? <TopPage /> : <Login />}
          </Container>
        </main>
      </SnackbarProvider>
    </>
  );
}
