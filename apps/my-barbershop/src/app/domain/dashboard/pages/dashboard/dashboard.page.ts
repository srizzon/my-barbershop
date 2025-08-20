import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { Component, computed, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { STOREFRONT_FORM_CONFIG } from '@domain/dashboard/constants/storefront-form.constant';
import { StorefrontApi } from '@shared/apis/storefront.api';
import { iStorefront } from '@shared/interfaces/storefront.interface';
import { CompanyService } from '@shared/services/company/company.service';
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
    NzStatisticModule,
    NzTypographyModule,
    DynamicFormComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit, OnDestroy {
  private storefrontApi = inject(StorefrontApi);
  private companyService = inject(CompanyService);
  private notificationService = inject(NzNotificationService);

  selectedOption: eDashboardSegmentedOptions = eDashboardSegmentedOptions.TimeAndStatus;
  segmentedOptions = [eDashboardSegmentedOptions.TimeAndStatus, eDashboardSegmentedOptions.Settings];

  eDashboardSegmentedOptions = eDashboardSegmentedOptions;

  storefrontData = signal<iStorefront | null>(null);
  isOpen = signal<boolean>(false);
  configForm: iDynamicFormConfig[] = [];
  dynamicForm = viewChild(DynamicFormComponent);
  deadline = signal<number>(Date.now());
  private timeUpdateInterval: ReturnType<typeof setInterval> | null = null;

  hasWaitingTime = computed(() => {
    const storefront = this.storefrontData();
    return !!(storefront?.is_open && storefront?.estimated_finish_time && this.deadline() > Date.now());
  });

  ngOnInit(): void {
    this.loadData();
    // Update countdown every second
    this.timeUpdateInterval = setInterval(() => {
      this.updateDeadline();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
  }

  async loadData() {
    const storefront = await this.storefrontApi.getByCompanyId();
    this.storefrontData.set(storefront);

    if (storefront) {
      this.configForm = STOREFRONT_FORM_CONFIG(storefront);
      this.isOpen.set(storefront.is_open || false);
      this.updateDeadline();
    }
  }

  updateDeadline() {
    const storefront = this.storefrontData();
    if (storefront?.estimated_finish_time) {
      const finishTime = new Date(storefront.estimated_finish_time).getTime();
      this.deadline.set(finishTime > Date.now() ? finishTime : Date.now());
    } else {
      this.deadline.set(Date.now());
    }
  }

  handleValueChange(e: string | number): void {
    this.selectedOption = e as eDashboardSegmentedOptions;
  }

  adjustWaitingTime(minutesToAdd: number) {
    const storefront = this.storefrontData();
    if (!storefront) return;

    // Add or subtract minutes from current estimated finish time
    // If no current time, start from now
    const baseTime = storefront.estimated_finish_time ? new Date(storefront.estimated_finish_time) : new Date();

    // For queue management: always adjust based on current state
    const newTime = new Date(baseTime.getTime() + minutesToAdd * 60000);

    // If the new time is in the past, set to null (no queue)
    const newFinishTime = newTime > new Date() ? newTime : null;

    storefront.estimated_finish_time = newFinishTime ? newFinishTime.toISOString() : null;
    this.storefrontData.set(storefront);
    this.updateDeadline();
    this.autoSaveTimeAndStatus();
  }

  setWaitingTime(minutes: number) {
    const storefront = this.storefrontData();
    if (!storefront) return;

    const newFinishTime = minutes > 0 ? new Date(Date.now() + minutes * 60000) : null;

    storefront.estimated_finish_time = newFinishTime ? newFinishTime.toISOString() : null;
    this.storefrontData.set(storefront);
    this.updateDeadline();
    this.autoSaveTimeAndStatus();
  }

  toggleStoreStatus() {
    this.isOpen.set(!this.isOpen());
    this.autoSaveTimeAndStatus();
  }

  private async autoSaveTimeAndStatus() {
    const storefront = this.storefrontData();
    if (!storefront?.id) {
      this.notificationService.error('Erro', 'ID da loja não encontrado.');
      return;
    }

    const { error } = await this.storefrontApi.updateTimeAndStatus(storefront.id, storefront.estimated_finish_time, this.isOpen());
    if (error) {
      this.notificationService.error('Erro', 'Não foi possível salvar as alterações.');
      return;
    }
  }

  async submit() {
    const formValues = this.dynamicForm()?.form.value;
    const storefront = this.storefrontData();

    const { error } = await this.storefrontApi.insertOrUpdate({
      company_id: this.companyService.company()?.id,
      ...storefront,
      ...formValues,
      is_open: this.isOpen(),
    });
    if (error) {
      this.notificationService.error('Erro', 'Ocorreu um erro ao salvar as configurações.');
      return;
    }

    this.notificationService.success('Sucesso', 'Configurações salvas com sucesso!');
  }
}
