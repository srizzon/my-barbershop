import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'subscription',
    loadChildren: () => import('./domain/subscription/subscription.routes').then(m => m.SUBSCRIPTION_ROUTES),
  },
  {
    path: 'auth',
    loadComponent: () => import('./core/layout/auth/auth.layout').then(m => m.AuthLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./domain/auth/auth.routes').then(m => m.AUTH_ROUTES),
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./core/pages/reset-password/reset-password.page').then(m => m.ResetPasswordPage),
      },
    ],
  },
];
