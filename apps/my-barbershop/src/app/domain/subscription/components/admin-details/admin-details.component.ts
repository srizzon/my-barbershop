import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { debounceTime } from 'rxjs';

import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { eSubscriptionStep } from '@domain/subscription/enums/subscription-step.enum';
import { SubscriptionService } from '@domain/subscription/services/subscription.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { eDynamicField } from '@widget/components/dynamic-form/dynamic-field.enum';
import { iDynamicFormConfig } from '@widget/components/dynamic-form/dynamic-form-config.interface';
import { DynamicFormComponent } from '@widget/components/dynamic-form/dynamic-form.component';

@UntilDestroy()
@Component({
  selector: 'mb-admin-details',
  imports: [DynamicFormComponent, NzButtonModule, NzFlexModule, NzIconModule, NzTypographyModule, RouterModule],
  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.scss',
})
export class AdminDetailsComponent implements AfterViewInit, OnInit {
  private subscriptionService = inject(SubscriptionService);

  formConfig: iDynamicFormConfig[] = [
    {
      label: 'Nome',
      name: 'name',
      type: {
        field: eDynamicField.INPUT,
      },
      validations: [Validators.required],
      size: 24,
    },
    {
      label: 'E-mail',
      name: 'email',
      type: {
        field: eDynamicField.INPUT,
      },
      validations: [Validators.required, Validators.email],
      size: 24,
    },
    {
      label: 'Telefone',
      name: 'phone',
      type: {
        field: eDynamicField.INPUT,
        typeField: 'tel',
      },
      mask: '(00) 00000-0000||(00) 0000-0000',
      validations: [Validators.required],
      size: 24,
    },
    {
      label: 'Senha',
      name: 'password',
      type: {
        field: eDynamicField.INPUT,
        typeField: 'password',
      },
      validations: [Validators.required],
      size: 24,
    },
  ];

  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;

  ngOnInit(): void {
    this.subscriptionService.currentStep.set(eSubscriptionStep.ADMIN);
  }

  ngAfterViewInit(): void {
    this.dynamicForm?.form.valueChanges.pipe(untilDestroyed(this), debounceTime(300)).subscribe(value => {
      const form = this.subscriptionService.getAdminForm();
      form.patchValue(value);
    });

    this.dynamicForm.form.patchValue(this.subscriptionService.getAdminForm().value);
  }
}
