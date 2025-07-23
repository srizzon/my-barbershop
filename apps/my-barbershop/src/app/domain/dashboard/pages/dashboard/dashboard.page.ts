import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { eDynamicField } from '@widget/components/dynamic-form/dynamic-field.enum';
import { iDynamicFormConfig } from '@widget/components/dynamic-form/dynamic-form-config.interface';
import { DynamicFormComponent } from '@widget/components/dynamic-form/dynamic-form.component';

enum eDashboardSegmentedOptions {
  TimeAndStatus = 'Tempo & Status',
  Settings = 'Configurações',
}

@Component({
  selector: 'mb-dashboard',
  imports: [
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    NzFlexModule,
    NzDividerModule,
    NzGridModule,
    NzSwitchModule,
    NzSegmentedModule,
    NzSliderModule,
    NzTypographyModule,
    DynamicFormComponent,
    RouterModule,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  selectedOption: eDashboardSegmentedOptions = eDashboardSegmentedOptions.TimeAndStatus;
  segmentedOptions = [eDashboardSegmentedOptions.TimeAndStatus, eDashboardSegmentedOptions.Settings];

  eDashboardSegmentedOptions = eDashboardSegmentedOptions;

  configForm: iDynamicFormConfig[] = [
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
      placeholder: 'Nome da Barbearia',
      size: 24,
    },
    {
      label: 'Endereço',
      name: 'address',
      type: {
        field: eDynamicField.INPUT,
      },
      placeholder: 'Endereço da Barbearia',
      size: 24,
    },
    {
      label: 'Horário de Funcionamento',
      name: 'working_hours',
      type: {
        field: eDynamicField.INPUT,
      },
      placeholder: 'Horário de Funcionamento',
      size: 24,
    },
    {
      label: 'Serviços Oferecidos',
      name: 'services',
      type: {
        field: eDynamicField.TEXTAREA,
      },
      placeholder: 'Serviços Oferecidos',
      size: 24,
    },
  ];

  handleValueChange(e: string | number): void {
    this.selectedOption = e as eDashboardSegmentedOptions;
  }
}
