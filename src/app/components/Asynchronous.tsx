import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllStocks } from "../../../utils/supabaseFunctions";
import { Stock } from "../../../utils/type";

export default function Asynchronous() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const stocks:Stock[] | null = await getAllStocks();

      // 同じnameで、同じpriceのものはcount数で表示
      const group = (arr: Stock[], func = (v: Stock) => v, detail = false) => {
        const index: string[] = [];
        const result: [
          {
            id: Number;
            type: String;
            name: String;
            length: Number;
          }
        ] = [];

        arr.forEach((v) => {
          const funcResult = func(v);

          const i = index.indexOf(funcResult);
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

      const groupedStocks = group(stocks, (d) => d.name + d.price, { detail: true }).result.map(
          (e) => ({
            id: e[0].id,
            name: e[0].name,
            price: e[0].price,
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
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => `${option.name}　[ ${option.price}円(税込) ]　×${option.count}`}
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
          label="在庫検索"
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
