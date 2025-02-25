import { Route } from '@angular/router';

export const SUBSCRIPTION_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: '',
    title: 'Assinatura',
    loadComponent: () => import('./pages/subscription/subscription.page').then(m => m.SubscriptionPage),
    children: [
      {
        path: 'admin',
        loadComponent: () => import('./components/admin-details/admin-details.component').then(m => m.AdminDetailsComponent),
      },
      {
        path: 'company',
        loadComponent: () => import('./components/company-details/company-details.component').then(m => m.CompanyDetailsComponent),
      },
    ],
  },
];
