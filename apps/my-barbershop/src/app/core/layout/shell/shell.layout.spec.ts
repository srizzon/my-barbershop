import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellLayout } from './shell.layout';

describe('ShellLayout', () => {
  let component: ShellLayout;
  let fixture: ComponentFixture<ShellLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
