import { Route } from '@angular/router';
import { isLoggedInGuard } from '@core/guards/is-logged-in/is-logged-in.guard';

export const AUTH_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up/sign-up.page').then(m => m.SignUpPage),
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
    canActivate: [isLoggedInGuard],
  },
];
