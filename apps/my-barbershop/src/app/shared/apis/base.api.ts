import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '@domain/auth/services/auth.service';
import { injectSupabase } from '@shared/functions/inject-supabase.function';
import { iBase } from '@shared/interfaces/base.interface';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseApi<T extends Partial<iBase>> {
  private authService = inject(AuthService);
  protected http = inject(HttpClient);

  supabase = injectSupabase();

  constructor(protected tableName: string) {}

  getById(id: string) {
    return this.supabase.from(this.tableName).select('*').eq('id', id).match({ active: true }).single();
  }

  select(select = '*', options: { isAscending?: boolean; active?: boolean; orderByCreatedAt?: boolean } = { isAscending: true, active: true, orderByCreatedAt: true }) {
    if (options.active === undefined) options.active = true;
    if (options.isAscending === undefined) options.isAscending = true;

    let query = this.supabase.from(this.tableName).select(select, { count: 'exact' }).eq('active', options.active);

    if (options.orderByCreatedAt) {
      query = query.order('created_at', { ascending: options.isAscending });
    }

    return query;
  }

  insertOrUpdate(payload: T) {
    return payload.id ? this.update(payload).eq('id', payload.id) : this.insert(payload);
  }

  insert(payload: Omit<T, keyof iBase>) {
    return this.supabase.from(this.tableName).insert([{ ...payload, created_by: this.authService.currentUser()?.id, active: true }]);
  }

  insertMany(payload: Omit<T, keyof iBase>[]) {
    return this.supabase.from(this.tableName).insert(
      payload.map(item => {
        return { ...item, created_by: this.authService.currentUser()?.id, active: true };
      }),
    );
  }

  update(payload: Partial<T>) {
    payload.updated_by = this.authService.currentUser()?.id;
    payload.updated_at = new Date();

    return this.supabase.from(this.tableName).update([payload]);
  }

  deleteById(id: string, columnName = 'id') {
    return this.supabase.from(this.tableName).delete().eq(columnName, id);
  }

  inactiveById(id: string, columnName = 'id') {
    return this.supabase.from(this.tableName).update({ active: false }).eq(columnName, id);
  }

  inactiveByIds(ids: string[], columnName = 'id') {
    return this.supabase.from(this.tableName).update({ active: false }).in(columnName, ids);
  }
}
