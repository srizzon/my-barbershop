import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { debounceTime } from 'rxjs';

import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { COMPANY_FORM_CONFIG } from '@domain/subscription/constants/company-form-config.constant';
import { eSubscriptionStep } from '@domain/subscription/enums/subscription-step.enum';
import { SubscriptionService } from '@domain/subscription/services/subscription.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { iDynamicFormConfig } from '@widget/components/dynamic-form/dynamic-form-config.interface';
import { DynamicFormComponent } from '@widget/components/dynamic-form/dynamic-form.component';

@UntilDestroy()
@Component({
  selector: 'mb-company-details',
  imports: [DynamicFormComponent, NzButtonModule, NzFlexModule, NzIconModule, NzTypographyModule, RouterModule],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss',
})
export class CompanyDetailsComponent implements OnInit, AfterViewInit {
  private subscriptionService = inject(SubscriptionService);

  formConfig: iDynamicFormConfig[] = COMPANY_FORM_CONFIG();

  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;

  ngOnInit(): void {
    this.subscriptionService.currentStep.set(eSubscriptionStep.COMPANY);
  }

  ngAfterViewInit(): void {
    this.dynamicForm?.form.statusChanges.pipe(untilDestroyed(this), debounceTime(300)).subscribe(() => {
      const form = this.subscriptionService.getCompanyForm();
      form.patchValue(this.dynamicForm.form.getRawValue());
    });

    this.dynamicForm.form.patchValue(this.subscriptionService.getCompanyForm().getRawValue());
  }

  submit() {
    this.subscriptionService.submit();
  }
}
