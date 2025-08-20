import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { StorefrontApi } from '@shared/apis/storefront.api';
import { iStorefront } from '@shared/interfaces/storefront.interface';
import { RealtimeChannel } from '@supabase/supabase-js';

@Component({
  selector: 'mb-storefront',
  imports: [
    CommonModule,
    NzBadgeModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    NzDividerModule,
    NzGridModule,
    NzTagModule,
    NzFlexDirective,
    NzStatisticModule,
    NzTypographyModule,
  ],
  templateUrl: './storefront.page.html',
  styleUrl: './storefront.page.scss',
})
export class StorefrontPage implements OnInit, OnDestroy {
  @Input() id = '';

  private storefrontApi = inject(StorefrontApi);
  private realtimeChannel: RealtimeChannel | null = null;
  private timeUpdateInterval: ReturnType<typeof setInterval> | null = null;

  storefrontData = signal<iStorefront | null>(null);
  deadline = signal<number>(Date.now());
  currentTime = signal<number>(Date.now());

  hasWaitingTime = computed(() => {
    const storefront = this.storefrontData();
    if (!storefront?.is_open || !storefront?.estimated_finish_time) {
      return false;
    }
    return this.deadline() > this.currentTime();
  });

  ngOnInit(): void {
    this.initializeStorefront();

    this.timeUpdateInterval = setInterval(() => {
      this.currentTime.set(Date.now());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
  }

  async initializeStorefront() {
    const data = await this.storefrontApi.getByCompanyId();
    if (data) {
      this.updateStorefrontData(data);

      this.realtimeChannel = this.storefrontApi.subscribeToStorefrontChanges(data.id, updatedData => {
        this.updateStorefrontData(updatedData);
      });
    }
  }

  private updateStorefrontData(data: iStorefront) {
    this.storefrontData.set(data);

    if (data.estimated_finish_time) {
      const finishTime = new Date(data.estimated_finish_time).getTime();
      this.deadline.set(finishTime > Date.now() ? finishTime : Date.now());
    } else {
      this.deadline.set(Date.now());
    }
  }
}
