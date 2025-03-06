import { AfterViewChecked, Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Tag } from '../../model/todo.type';

function isLightColor(hex: string) {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = rgb & 0xff;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 128 ? true : false;
}

@Directive({
  selector: '[appTagColor]'
})
export class TagColorDirective implements AfterViewChecked, OnChanges{
  @Input() tagColorArray!: Tag[];
  constructor(private el: ElementRef) {}
  ngAfterViewChecked(): void {
    this.updateTagStyles();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTags']) {
      this.updateTagStyles();
    }
  }
  updateTagStyles(): void {
    const tags = this.el.nativeElement.querySelectorAll('.ant-select-selection-item');
    tags.forEach((tag: HTMLElement) => {
      if (tag instanceof HTMLElement) {
        let newColor = this.tagColorArray.find((index) => index.title == tag.title)!.color;
        tag.style.backgroundColor = newColor;
        tag.style.color = isLightColor(newColor) ? 'black' : 'white';
        tag.style.fontWeight = 'bold';
        tag.style.borderRadius = '5px';
        tag.style.width = 'fit-content';
        tag.style.fontSize = '10px';
        tag.style.paddingLeft = '5px';
      }
    })
  }
}
