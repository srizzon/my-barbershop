import { iStorefront } from '@shared/interfaces/storefront.interface';
import { eDynamicField } from '@widget/components/dynamic-form/dynamic-field.enum';
import { iDynamicFormConfig } from '@widget/components/dynamic-form/dynamic-form-config.interface';

export const STOREFRONT_FORM_CONFIG = (storefront?: iStorefront): iDynamicFormConfig[] => {
  return [
    {
      label: 'Foto',
      name: 'photo',
      type: {
        field: eDynamicField.AVATAR,
      },
      size: 24,
    },
    {
      label: 'Nome da Barbearia',
      name: 'name',
      type: {
        field: eDynamicField.INPUT,
      },
      initialValue: storefront?.name || '',
      placeholder: 'Nome da Barbearia',
      size: 24,
    },
    {
      label: 'Endereço',
      name: 'address',
      type: {
        field: eDynamicField.INPUT,
      },
      initialValue: storefront?.address || '',
      placeholder: 'Endereço da Barbearia',
      size: 24,
    },
    {
      label: 'Horário de Funcionamento',
      name: 'working_hours',
      type: {
        field: eDynamicField.INPUT,
      },
      initialValue: storefront?.working_hours || '',
      placeholder: 'Horário de Funcionamento',
      size: 24,
    },
    {
      label: 'Serviços Oferecidos',
      name: 'services',
      type: {
        field: eDynamicField.TEXTAREA,
      },
      initialValue: storefront?.services || '',
      placeholder: 'Serviços Oferecidos',
      size: 24,
    },
  ];
};
