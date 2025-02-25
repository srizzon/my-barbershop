import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { eSubscriptionStep } from '../enums/subscription-step.enum';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  currentStep = eSubscriptionStep.ADMIN;

  form = new FormGroup({
    admin: new FormGroup({
      name: new FormControl<string | null>(null),
      email: new FormControl<string | null>(null),
      phone: new FormControl<string | null>(null),
      password: new FormControl<string | null>(null),
    }),
    company: new FormGroup({
      name: new FormControl<string | null>(null),
      cnpj: new FormControl<string | null>(null),
      zip_code: new FormControl<string | null>(null),
      street: new FormControl<string | null>(null),
      number: new FormControl<string | null>(null),
      complement: new FormControl<string | null>(null),
      neighborhood: new FormControl<string | null>(null),
      city: new FormControl<string | null>(null),
      state: new FormControl<string | null>(null),
      country: new FormControl<string | null>(null),
    }),
  });

  getAdminForm() {
    return this.form.get('admin') as FormGroup;
  }

  getCompanyForm() {
    return this.form.get('company') as FormGroup;
  }

  submit() {
    console.log(this.form.value);
  }
}
