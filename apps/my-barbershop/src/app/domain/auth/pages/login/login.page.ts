import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';

import { Component, inject } from '@angular/core';
import { ThemeService } from '@shared/services/theme/theme.service';

@Component({
  selector: 'mb-login',
  imports: [NzButtonComponent, NzFlexModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private themeService = inject(ThemeService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
