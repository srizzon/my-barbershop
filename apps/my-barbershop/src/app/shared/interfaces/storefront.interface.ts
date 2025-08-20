import { iBase } from './base.interface';

export interface iStorefront extends iBase {
  company_id: string;
  photo: string;
  name: string;
  address: string;
  working_hours: string;
  services: string;
  estimated_finish_time: string | null;
  is_open: boolean;
}
