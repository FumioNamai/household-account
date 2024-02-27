export type Stock = {
  id: number;
  type: string;
  name: string;
  user_id: string | null;
  price: number;
  category: string | null;
  registration_date: string | null;
  use_date:  string | null;
  count: number;
}
