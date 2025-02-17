import { inject } from '@angular/core';
import { SupabaseService } from '@shared/services/supabase/supabase.service';

export const injectSupabase = () => {
  const supabaseService = inject(SupabaseService);
  return supabaseService.supabase;
};
