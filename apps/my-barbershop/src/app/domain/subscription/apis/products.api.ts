import { Injectable } from '@angular/core';
import { BaseApi } from '@shared/apis/base.api';

import { iProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsApi extends BaseApi<iProduct> {
  constructor() {
    super('products');
  }

  async getAll() {
    const { data } = await this.supabase.from(this.tableName).select('*, prices!inner(*)', { count: 'exact' }).eq('active', true).returns<iProduct[]>();
    return data || [];
  }
}
