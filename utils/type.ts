export interface Stock {
  id: number;
  type: string;
  name: string;
  user_id: string | null;
  price: number;
  reference_price: number | null;
  category: string | null;
  registration_date: string | null;
  use_date:  string | null;
  to_buy: boolean;
  shop_name: string;
  checked: boolean;
}

export interface GroupedData extends Stock {
  count: number;
}
