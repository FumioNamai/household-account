"use client";
import React, { useEffect, useMemo, useState } from "react";

import { Stock } from "../../../utils/type";
import { useSnackbarContext } from "@/providers/context-provider";
import { supabase } from "../../../utils/supabase";

import { Dayjs } from "dayjs";
import dayjs from "dayjs";

import Monthly from "@/app/components/monthly";
import Daily from "@/app/components/daily";
import StockFilter from "@/app/components/stockFilter";
import useStore from "@/store/index";
import {useModeStore} from "@/store/mode";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button, CssBaseline, PaletteMode, colors, useMediaQuery } from "@mui/material";
import { grey } from "@mui/material/colors";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import ModeSwitch from "./modeSwitch";
// import ModeSwitch from "./modeSwitch";
import { colorTheme } from "./colorTheme";

export default function TopPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const { showSnackbar } = useSnackbarContext();
  const user = useStore((state) => (state.user));

  const mode = useModeStore((state) => (state.mode));
  console.log("TopPage",mode);
  const theme = useMemo(() => colorTheme(mode), [mode]);


  // const { mode, setMode} = useModeStore()


    // OSの設定に連動させるパターン
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // const theme = useMemo(() => colorTheme(prefersDarkMode), [prefersDarkMode]);
  // const theme = colorTheme(prefersDarkMode)


  // const [mode, setMode] = useState<PaletteMode>('light')

  // const colorMode = useMemo(() => ({
  //   toggleColorMode: () =>
  //   {
  //     setMode((prevMode) => (prevMode === "light" ? 'dark' :'light' ))
  //   },
  // })
  // ,[]
  // )

  // const theme = useMemo(() =>
  // createTheme({
  //   palette: {
  //     mode: mode as PaletteMode,
  //   },
  // }),
  // [mode]
  // )

  // const theme = createTheme({
  //   palette: {
  //     ...(mode === "light" ? {
  //       text: {
  //         primary: grey[900],
  //         secondary: grey[800],
  //       },
  //       background: {
  //         paper: grey[100],
  //         default: grey[100],
  //       }
  //     } : {
  //       divider:grey[700],
  //       text: {
  //         primary: grey[100],
  //         secondary: grey[200],
  //       },
  //       background: {
  //         paper: grey[900],
  //         default: grey[900],
  //       },
  //       action: {
  //         active: grey[200],
  //       }
  //     })
  //   },
  // })
  // palette: {
  //   primary: {
  //     main: colors.blue[600],
  //   },
  //   mode: 'dark' ? "dark" : "light",
  // },

  // const toggleColorMode = () => {
  //   setMode()
  // }

  const getStocks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      setStocks(data);
      return;
    } catch (error: any) {
      if (showSnackbar) {
        showSnackbar("error", "在庫データを取得できません。" + error.message);
      }
      setStocks([]);
    }
  };

  useEffect(() => {
    (async () => await getStocks(user.id))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const groupedData: { [key: string]: any } = {};

  stocks.forEach((stock) => {
    if (!stock.use_date) {
      const key = `${stock.name}-${stock.price}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          id: stock.id,
          name: stock.name,
          price: stock.price,
          count: 0,
          type: stock.type,
          registration_date: stock.registration_date,
          use_date: stock.use_date,
          category: stock.category,
        };
      }
      groupedData[key].count++;
    }
  });
  const groupedDataArr = Object.values(groupedData);

  let [date, setDate] = useState<Dayjs | null>(dayjs());

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ModeSwitch />
        <main>
          {/* 月別集計 */}
          <Monthly stocks={stocks} setStocks={setStocks} />

          {/* 日別集計 */}
          <Daily
            stocks={stocks}
            setStocks={setStocks}
            date={date}
            setDate={setDate}
          />

          {/* 在庫一覧 */}
          {/* <StockList
          stocks={stocks}
          setStocks={setStocks}
          date={date}
          setDate={setDate}
        /> */}

          {/* 在庫検索 */}
          <StockFilter
            groupedDataArr={groupedDataArr}
            stocks={stocks}
            setStocks={setStocks}
            date={date}
            setDate={setDate}
          />
        </main>
      </ThemeProvider>
    </>
  );
}
