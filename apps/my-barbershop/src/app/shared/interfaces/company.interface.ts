import { iBase } from './base.interface';

export interface iCompany extends iBase {
  name: string | null;
  cnpj: string | null;
  address: iAddress | null;
}

export interface iAddress {
  zip_code: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}
