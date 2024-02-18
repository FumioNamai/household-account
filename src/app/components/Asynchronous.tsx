import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllStocks } from "../../../utils/supabaseFunctions";
import { Stock } from "../../../utils/type";
import useStore from "@/store";

export default function Asynchronous() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const { user } = useStore();

  useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }

    (async () => {
      const stocks:Stock[] | null = await getAllStocks();
        if (stocks!.some((stock) => stock.user_id !== user.id )) {
          alert("在庫データがありません。在庫登録を行ってください。");
          setOpen(false)
        }
        const filteredStocks = stocks!.filter((stock) => stock.user_id === user.id && stock.use_date === null)
        // 同じnameで、同じpriceのものはcount数で表示
        const group = (arr: any | null, func = (v:any) => v, detail = false ) => {
          const index: string[] = [];
          // const result: [
          //   {
          //     id: number;
          //     type: string;
          //     name: string;
          //     length: number;
          //   }
          // ] = [{id: 0 , type:"", name:"", length }];
          const result: any = []

          arr!.forEach((v:any) => {
            const funcResult: string = func(v);
            const i:number = index.indexOf(funcResult);
            if (i === -1) {
              index.push(funcResult);
              result.push([v]);
            } else {
              result[i].push(v);
            }
          });
          if (detail) {
            return { index, result };
          }
          return result;
        };

        const groupedStocks = group(filteredStocks, (d) => d.name + d.price, true ).result.map(
          (e: any) => ({
            id: e[0].id,
            name: e[0].name,
            price: e[0].price,
            type: e [0].type,
            category: e[0].category,
            count: e.length,
          })
          )
          if (active) {
            setOptions(groupedStocks);
          }
        })();

        return () => {
          active = false;
        };
      }, [loading]);

      React.useEffect(() => {
        if (!open) {
          setOptions([]);
        }
      }, [open]);

  return (
    <Autocomplete
      sx={{ width: "100%", maxHeight: 200 }}
      freeSolo
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option:any, value) => option.id === value.id}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) =>
      `[${option.category ? option.category: option.type}] ${option.name} : ${option.price}円 ×${option.count}`
    }
      // getOptionLabel={(option) => option.name}
      // value={selectedValue}
      // groupBy={(option) => option.type}
      options={options}
      // loading={loading}
      // onChange={(e) => console.log(e.target.innerText)}
      // onChange={(e) => setSelectedValue(e.target.value)}
      // onChange={setSelectedValue}

      // 検索してリストを表示することと、在庫の登録はできるが、リストから選択するとエラーになる
      // valueの値をイベントハンドラを通して、setPnameに渡せていない？
      // inputValue={pname}
      // onInputChange={(event: React.SyntheticEvent) => setPName(event.target.value)}

      // onChange={setPName}
      renderInput={(params) => (
        <TextField
          {...params}
          label="在庫検索（税込）"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {/* {params.InputProps.endAdornment} */}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
