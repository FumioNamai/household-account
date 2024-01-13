import { log } from "console"
import { supabase } from "../../../utils/supabase"

const UsedItem = ({props,onUpdate}) => {

  const handleReturn = async (propsID:number) => {
    const date = null
    try {
      const res = await supabase.from("stocks").update({ use_date:date}).eq("id",propsID)
      const { data:stocks } = await supabase.from("stocks").select("*")
      onUpdate(stocks)
    }catch(error) {
      alert("在庫に戻せません" + error.message)
    }
  }

  return (
    <li key = {props.id} className="flex flex-row gap-1 items-center p-1 min-w-60">
      {/* <p className="text-xs min-w-8 text-end">{useDate}日</p> */}
    <p className="text-xs min-w-28 text-start">{props.name}</p>

      <p className=" text-xs min-w-16 text-end">@ {props.price}円</p>
      <button className="border p-1 text-xs" onClick={(e) => handleReturn(props.id)}>戻</button>
  </li>
  )
}

export default UsedItem
