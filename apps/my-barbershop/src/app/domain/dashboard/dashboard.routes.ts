import { Route } from '@angular/router';

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
  },
];
