export interface Stock {
  id: number;
  type: string;
  name: string;
  price: number;
  category: string;
  registration_date: string | null;
  use_date:  string | null;
}
