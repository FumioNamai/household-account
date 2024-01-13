import { log } from "console"

const UsedItem = ({props}) => {
  const useDate = props.use_date.slice(8)

  return (
    <li key = {props.id} className="flex flex-row gap-1 items-center p-1 min-w-60">
      {/* <p className="text-xs min-w-8 text-end">{useDate}日</p> */}
    <p className="text-xs min-w-28 text-start">{props.name}</p>

      <p className=" text-xs min-w-16 text-end">@ {props.price}円</p>
      <button className="border p-1 text-xs">戻</button>
  </li>
  )
}

export default UsedItem
