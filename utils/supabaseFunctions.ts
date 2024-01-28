import { log } from "console"
import { supabase } from "./supabase"

export const getAllStocks = async () => {
  const stocks = await supabase.from("stocks").select("*")
  return stocks.data
}

export const addStock = async (form) => {

  await supabase.from("stocks").insert({type:form.type,name:form.name,price:form.price})
}
