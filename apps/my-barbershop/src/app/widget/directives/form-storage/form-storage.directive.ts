import { debounceTime, Subject, takeUntil } from 'rxjs';

import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: 'form[formGroup][mbFormStorage]',
  standalone: true,
})
export class FormStorageDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() formGroup!: FormGroup;
  @Input() mbFormStorage = 'mbFormStorage';

  ngOnInit(): void {
    this.updateFormValue();
    this.listenUpdateValue();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateFormValue(): void {
    const storageValue = JSON.parse(localStorage.getItem(this.mbFormStorage) || '{}');
    if (storageValue) {
      this.formGroup.patchValue(storageValue);
    }
  }

  private listenUpdateValue(): void {
    this.formGroup.valueChanges.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(value => localStorage.setItem(this.mbFormStorage, JSON.stringify(value)));
  }
}
