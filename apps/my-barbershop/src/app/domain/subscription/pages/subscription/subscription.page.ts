import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStepsModule } from 'ng-zorro-antd/steps';

import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SubscriptionService } from '@domain/subscription/services/subscription.service';
import { FormStorageDirective } from '@widget/directives/form-storage/form-storage.directive';

@Component({
  selector: 'mb-subscription',
  imports: [NzCardModule, NzStepsModule, RouterModule, FormStorageDirective, ReactiveFormsModule],
  templateUrl: './subscription.page.html',
  styleUrl: './subscription.page.scss',
})
export class SubscriptionPage {
  protected subscriptionService = inject(SubscriptionService);
}
