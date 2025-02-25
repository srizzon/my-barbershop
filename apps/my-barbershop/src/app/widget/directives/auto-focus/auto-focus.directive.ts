import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[mbAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
  @Input('mbAutoFocus') autoFocus?: boolean = true;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    if (!this.autoFocus) return;

    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 500);
  }
}
