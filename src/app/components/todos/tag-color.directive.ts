import { AfterViewChecked, AfterViewInit, Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Tag } from '../../model/todo.type';

function getTextColor(backgroundColor: string): string {
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };
  const luminance = (r: number, g: number, b: number): number => {
    const a = [r, g, b].map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };
  const { r, g, b } = hexToRgb(backgroundColor);
  const bgLuminance = luminance(r, g, b);
  return bgLuminance > 0.5 ? '#000000' : '#FFFFFF';
}

@Directive({
  selector: '[appTagColor]'
})
export class TagColorDirective implements AfterViewInit, OnChanges{
  @Input() tagColorArray!: Tag[];
  @Input() currTags!: string[];
  constructor(private el: ElementRef) {}
  ngAfterViewInit(): void {
    setTimeout(() => this.updateTagStyles(), 0);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currTags']) setTimeout(() => this.updateTagStyles(), 0);
  }
  updateTagStyles(): void {
    const tags = this.el.nativeElement.querySelectorAll('.ant-select-selection-item');
    tags.forEach((tag: HTMLElement) => {
      if (tag instanceof HTMLElement) {
        let newColor = this.tagColorArray.find((index) => index.title == tag.title)!.color;
        tag.style.backgroundColor = newColor;
        tag.style.color = getTextColor(newColor);
        tag.style.fontWeight = 'bold';
        tag.style.borderRadius = '5px';
        tag.style.width = 'fit-content';
        tag.style.fontSize = '10px';
        tag.style.paddingLeft = '5px';
      }
    })
  }
}
