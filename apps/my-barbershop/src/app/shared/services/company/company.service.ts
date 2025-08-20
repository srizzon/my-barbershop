import { Injectable, signal } from '@angular/core';
import { injectSupabase } from '@shared/functions/inject-supabase.function';
import { iCompany } from '@shared/interfaces/company.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private supabase = injectSupabase();

  company = signal<iCompany | null>(null);

  async load() {
    const { data } = await this.supabase.from('company').select('*').limit(1).maybeSingle();
    this.company.set(data);
  }
}
