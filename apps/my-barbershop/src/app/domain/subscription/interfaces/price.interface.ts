import { iProduct } from './product.interface';

export interface iPrice {
  id: string;
  active: boolean;
  currency: string;
  interval: string;
  interval_count: number;
  nickname: string;
  product_id: string;
  type: string;
  unit_amount: number;
  created: Date;
  metadata: unknown;
  slug: string;
  lookup_key?: string;

  products?: iProduct;
}
