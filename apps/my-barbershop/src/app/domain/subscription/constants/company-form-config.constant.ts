import cep from 'cep-promise';

import { FormGroup, Validators } from '@angular/forms';
import { eDynamicField } from '@widget/components/dynamic-form/dynamic-field.enum';
import { iDynamicFormConfig } from '@widget/components/dynamic-form/dynamic-form-config.interface';

import { UF_LIST } from './ufs.constant';

export const COMPANY_FORM_CONFIG = (): iDynamicFormConfig[] => {
  const enableFields = (form: FormGroup, fields: string[]) => {
    fields.forEach(field => {
      form.get(field)?.enable();
    });
  };

  const disableFields = (form: FormGroup, fields: string[]) => {
    fields.forEach(field => {
      form.get(field)?.disable();
    });
  };

  return [
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
      label: 'CNPJ',
      name: 'cnpj',
      type: {
        field: eDynamicField.INPUT,
      },
      mask: '00.000.000/0000-00',
      validations: [Validators.required],
      size: 24,
    },
    {
      label: 'CEP',
      name: 'zip_code',
      type: {
        field: eDynamicField.INPUT,
      },
      hint: 'Digite o CEP para preencher os campos abaixo.',
      mask: '00000-000',
      size: 24,
      validations: [Validators.required],
      onChange: async (zipCode, form) => {
        const control = form.get('zip_code');
        if (control?.invalid) return;

        try {
          const address = await cep(zipCode as string);
          form.patchValue({
            street: address.street,
            neighborhood: address.neighborhood,
            city: address.city,
            state: UF_LIST.find(uf => uf.value === address.state)?.name,
            country: 'Brasil',
          });

          disableFields(form, ['street', 'neighborhood', 'city', 'state', 'country']);
        } catch (error) {
          form.patchValue({
            street: null,
            neighborhood: null,
            city: null,
            state: null,
            country: null,
          });

          enableFields(form, ['street', 'neighborhood', 'city', 'state', 'country']);
        }
      },
    },
    {
      label: 'Rua',
      name: 'street',
      type: {
        field: eDynamicField.INPUT,
      },
      disabled: true,
      size: 18,
      validations: [Validators.required],
    },
    {
      label: 'Número',
      name: 'number',
      type: {
        field: eDynamicField.INPUT,
      },
      size: 6,
      validations: [Validators.required],
    },
    {
      label: 'Complemento',
      name: 'complement',
      type: {
        field: eDynamicField.INPUT,
      },
      size: 12,
    },
    {
      label: 'Bairro',
      name: 'neighborhood',
      type: {
        field: eDynamicField.INPUT,
      },
      disabled: true,
      size: 12,
      validations: [Validators.required],
    },
    {
      label: 'Cidade',
      name: 'city',
      type: {
        field: eDynamicField.INPUT,
      },
      disabled: true,
      size: 8,
      validations: [Validators.required],
    },
    {
      label: 'Estado',
      name: 'state',
      type: {
        field: eDynamicField.INPUT,
      },
      disabled: true,
      size: 8,
      validations: [Validators.required],
    },
    {
      label: 'País',
      name: 'country',
      type: {
        field: eDynamicField.INPUT,
      },
      disabled: true,
      size: 8,
      validations: [Validators.required],
    },
  ];
};
