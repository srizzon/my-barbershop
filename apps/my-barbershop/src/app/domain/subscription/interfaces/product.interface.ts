import { iPrice } from './price.interface';

export interface iProduct {
  id: string;
  active: boolean;
  name: string;
  description: string;
  image: string;
  slug: string;
  metadata: { [key: string]: string };

  prices?: iPrice[];
}
