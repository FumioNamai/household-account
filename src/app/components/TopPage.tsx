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
import useStore, { useModeStore } from "@/store";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, CssBaseline } from "@mui/material";
import { grey } from "@mui/material/colors";
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import NightlightRoundedIcon from '@mui/icons-material/NightlightRounded';
import ModeSwitch from "./modeSwitch";
import { colorTheme } from "./colorTheme";

export default function TopPage() {
  const { showSnackbar } = useSnackbarContext();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const { user } = useStore()
  const { mode, } = useModeStore()
  const theme = useMemo(()=>colorTheme(mode),
    [mode]
  )
  // const { mode,setMode}  = useModeStore()
  // const [mode, setMode] = useState('light')
  // const theme = createTheme({
  //   palette: {
  //     ...(mode === true ? {
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
  // const toggleColorMode = () => {
  //   setMode()
  // }
  // const toggleColorMode = () => {
  //   setMode((prevMode) => (prevMode === "light" ? 'dark' :'light' ))
  // }

  const getStocks = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("stocks").select("*")
      .eq("user_id", userId);
      if (error) throw error;
      setStocks(data);
      return
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


  const groupedData: { [key: string]: any }  = {}

  stocks.forEach(stock => {
    if(!stock.use_date) {
      const key = `${stock.name}-${stock.price}`;
      if (!groupedData[key]) {
        groupedData[key] =
        {
            id: stock.id,
            name:stock.name,
            price: stock.price,
            count:0,
            type: stock.type,
            registration_date:stock.registration_date,
            use_date:stock.use_date,
            category: stock.category,
          }
        }
        groupedData[key].count++
    }
    })
    const groupedDataArr = Object.values(groupedData)

  let [date, setDate] = useState<Dayjs | null>(dayjs());

  return (
    <>
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <ModeSwitch />
        {/* <Button
        sx={{padding:0, minWidth:"24px"}}
        onClick={toggleColorMode}
        >{mode === false ? <LightModeRoundedIcon /> : <NightlightRoundedIcon /> }
        </Button> */}

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
