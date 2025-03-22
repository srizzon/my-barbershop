import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPlanComponent } from './select-plan.component';

describe('SelectPlanComponent', () => {
  let component: SelectPlanComponent;
  let fixture: ComponentFixture<SelectPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
