import { inject, Injectable } from '@angular/core';
import { BaseApi } from '@shared/apis/base.api';
import { iStorefront } from '@shared/interfaces/storefront.interface';
import { CompanyService } from '@shared/services/company/company.service';
import { RealtimeChannel } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class StorefrontApi extends BaseApi<iStorefront> {
  private companyService = inject(CompanyService);

  constructor() {
    super('storefronts');
  }

  async getByCompanyId() {
    const { data } = await this.select('*').match({ company_id: this.companyService.company()?.id }).limit(1).maybeSingle();
    return data as iStorefront | null;
  }

  async updateTimeAndStatus(id: string, estimated_finish_time: string | null, is_open: boolean) {
    const { data, error } = await this.update({ estimated_finish_time, is_open }).eq('id', id).select().single();

    return { data: data as iStorefront | null, error };
  }

  getWaitingTimeInMinutes(estimated_finish_time: string | null): number {
    if (!estimated_finish_time) return 0;

    const now = new Date().getTime();
    const finishTime = new Date(estimated_finish_time).getTime();
    const diffMs = finishTime - now;

    return Math.max(0, Math.ceil(diffMs / 60000));
  }

  subscribeToStorefrontChanges(storefrontId: string, callback: (data: iStorefront) => void): RealtimeChannel {
    return this.supabase
      .channel(`storefront-${storefrontId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'storefronts',
          filter: `id=eq.${storefrontId}`,
        },
        payload => {
          callback(payload.new as iStorefront);
        },
      )
      .subscribe();
  }
}
