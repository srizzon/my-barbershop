import { Route } from '@angular/router';

export const STOREFRONT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/storefront/storefront.page').then(m => m.StorefrontPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/storefront/storefront.page').then(m => m.StorefrontPage),
  },
];
