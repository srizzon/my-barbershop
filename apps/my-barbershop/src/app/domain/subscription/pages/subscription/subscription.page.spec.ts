import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPage } from './subscription.page';

describe('SubscriptionPage', () => {
  let component: SubscriptionPage;
  let fixture: ComponentFixture<SubscriptionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
