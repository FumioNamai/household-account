export interface Stock {
  id: number;
  type: string;
  name: string;
  price: number;
  registration_date: string | null;
  use_date:  string | null;
}
