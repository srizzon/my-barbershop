import { booleanAttribute, Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({
  selector: '[mb-icon]',
  standalone: true,
  host: {
    class: 'material-icons-outlined',
    '[class.primary]': 'colorPrimary',
  },
})
export class IconDirective {
  private elementRef = inject(ElementRef);

  @Input({ transform: booleanAttribute }) colorPrimary?: boolean;
  @Input() set mbType(value: string | undefined) {
    this.elementRef.nativeElement.innerText = value;
  }
}
