export type Stock = {
  id: number;
  type: string;
  name: string;
  user_id: string | null;
  price: number;
  reference_price: number | null;
  category: string | null;
  registration_date: string | null;
  use_date:  string | null;
  count: number;
  to_buy: boolean;
  checked: boolean;
}

export type GroupedData  = {
  id: number;
  type: string;
  name: string;
  price: number;
  reference_price: number | null;
  category: string | null;
  registration_date: string | null;
  use_date:  string | null;
  count: number;
  to_buy: boolean;
  checked: boolean;
}
