import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { from, map, Observable } from 'rxjs';

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { injectSupabase } from '@shared/functions/inject-supabase.function';

interface Article {
  id: number;
  title: string;
  content: string;
}

@Component({
  selector: 'mb-login',
  imports: [NzButtonComponent, NzFlexModule, NzFormModule, NzInputModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private supabase = injectSupabase();
  private notificationService = inject(NzNotificationService);
  private router = inject(Router);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  async login() {
    if (!this.loginForm.valid) {
      this.notificationService.error('Erro', 'Preencha os campos corretamente');
      return;
    }

    const { email, password } = this.loginForm.value;
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      this.notificationService.error('Erro ao fazer login', 'Verifique suas credenciais e tente novamente');
      return;
    }

    this.router.navigate(['/']);
  }

  getArticles(): Observable<Article[] | null> {
    const promise = this.supabase.from('articles').select('*').returns<Article[]>();
    return from(promise).pipe(map(response => response.data));
  }
}
