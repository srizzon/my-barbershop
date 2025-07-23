import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorefrontPage } from './storefront.page';

describe('StorefrontPage', () => {
  let component: StorefrontPage;
  let fixture: ComponentFixture<StorefrontPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorefrontPage],
    }).compileComponents();

    fixture = TestBed.createComponent(StorefrontPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
