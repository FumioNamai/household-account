import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React from "react";
import { getAllStocks } from "../../../utils/supabaseFunctions";
import { Stock } from "../../../utils/type";

export default function Asynchronous(){
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  // const [selectedValue, setSelectedValue] = React.useState("")
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true

    if (!loading) {
      return undefined;
    }

    (async() => {
      const stocks = await getAllStocks()
      if(active) {
        setOptions(stocks)
      }
    })()

    return () => {
      active = false
    }
  },[loading])

  React.useEffect(() => {
    if (!open) {
      setOptions([])
    }
  },[open])

  return (
    <Autocomplete
    sx={{ width:300, maxHeight:200 }}
    freeSolo
    open={open}
    onOpen={() => {
      setOpen(true)
    }}
    onClose={() => {
      setOpen(false)
    }}
    isOptionEqualToValue={(option, value) => option.id === value.id}
    getOptionKey={(option) => option.id }
    getOptionLabel={(option) => `${option.name}[${option.price}円(税込)]`}
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
            {loading ? <CircularProgress color="inherit" size={20}/>:null }
            {/* {params.InputProps.endAdornment} */}
          </React.Fragment>
        ),
      }}
      />
    )}
    />
  )
}
