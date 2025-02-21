import { Directive, input, effect, inject, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlightCompletedTodos]'
})
export class HighlightCompletedTodosDirective {
  isCompleted = input(false);
  el = inject(ElementRef);
  constructor() { }
  stylesEffect = effect(() => {
    if(this.isCompleted()) {
      this.el.nativeElement.style.textDecoration = 'line-through';
      this.el.nativeElement.style.backgroundColor = '#d3f9d8';
      this.el.nativeElement.style.color = '#6c757d';
    } else {
      this.el.nativeElement.style.textDecoration = 'none';
      this.el.nativeElement.style.backgroundColor = 'white';
      this.el.nativeElement.style.color = '#000';
    }
  })
}
