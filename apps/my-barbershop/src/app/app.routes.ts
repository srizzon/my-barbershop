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
  {
    path: '',
    loadComponent: () => import('./core/layout/shell/shell.layout').then(m => m.ShellLayout),
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./domain/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'view',
        loadChildren: () => import('./domain/storefront/storefront.routes').then(m => m.STOREFRONT_ROUTES),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
];
