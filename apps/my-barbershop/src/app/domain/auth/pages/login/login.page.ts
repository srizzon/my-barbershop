import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { Component, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { injectSupabase } from '@shared/functions/inject-supabase.function';
import { eDynamicField } from '@widget/components/dynamic-form/dynamic-field.enum';
import { iDynamicFormConfig } from '@widget/components/dynamic-form/dynamic-form-config.interface';
import { DynamicFormComponent } from '@widget/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'mb-login',
  imports: [DynamicFormComponent, NzButtonComponent, NzFlexModule, NzFormModule, NzInputModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private supabase = injectSupabase();
  private notificationService = inject(NzNotificationService);
  private router = inject(Router);

  loginConfig: iDynamicFormConfig[] = [
    {
      label: 'Email',
      name: 'email',
      type: {
        field: eDynamicField.INPUT,
        typeField: 'email',
      },
      validations: [Validators.required, Validators.email],
      size: 24,
    },
    {
      label: 'Senha',
      name: 'password',
      type: {
        field: eDynamicField.INPUT,
        typeField: 'password',
      },
      showForgotPassword: true,
      forgotPasswordLink: 'forgot-password',
      validations: [Validators.required],
      size: 24,
    },
  ];

  @ViewChild(DynamicFormComponent) dynamicForm?: DynamicFormComponent;

  async login() {
    if (!this.dynamicForm?.form.valid) {
      this.notificationService.error('Erro', 'Preencha os campos corretamente');
      return;
    }

    const { email, password } = this.dynamicForm.form.value;
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      this.notificationService.error('Erro ao fazer login', 'Verifique suas credenciais e tente novamente');
      return;
    }

    this.router.navigate(['/']);
  }
}
