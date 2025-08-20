import { provideNzI18n, pt_BR } from 'ng-zorro-antd/i18n';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import pt from '@angular/common/locales/pt';
import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AuthService } from '@domain/auth/services/auth.service';
import { CompanyService } from '@shared/services/company/company.service';
import { ThemeService } from '@shared/services/theme/theme.service';

import { appRoutes } from './app.routes';

registerLocaleData(pt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideNzI18n(pt_BR),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideEnvironmentNgxMask(),
    provideAppInitializer(() => inject(ThemeService).loadTheme()),
    provideAppInitializer(() => inject(AuthService).load()),
    provideAppInitializer(() => inject(CompanyService).load()),
  ],
};
