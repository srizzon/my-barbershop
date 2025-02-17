import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { injectSupabase } from '@shared/functions/inject-supabase.function';

@Component({
  selector: 'mb-reset-password',
  imports: [NzButtonComponent, NzFormModule, NzInputModule, FormsModule, RouterModule],
  templateUrl: './reset-password.page.html',
  styleUrl: './reset-password.page.scss',
})
export class ResetPasswordPage {
  private supabase = injectSupabase();
  private notificationService = inject(NzNotificationService);
  private router = inject(Router);

  password = model('');

  async submit() {
    await this.supabase.auth.updateUser({ password: this.password() });
    this.notificationService.success('Senha alterada', 'Sua senha foi alterada com sucesso');

    this.password.set('');
    this.router.navigate(['/']);
  }
}
