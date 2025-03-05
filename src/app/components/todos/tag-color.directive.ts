import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Tag } from '../../model/todo.type';

@Directive({
  selector: '[appTagColor]'
})
export class TagColorDirective implements OnInit, OnChanges{
  @Input() tagArray: Tag[] = [];
  @Input() itemArray: string[] = [];
  constructor(private el: ElementRef) {}
  ngOnInit(): void {
    this.updateTagStyles();
    console.log(this.tagArray);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tagArray']) {
      this.updateTagStyles();
    }
  }
  
  updateTagStyles(): void {
    const tags = this.el.nativeElement.querySelectorAll('div.ant-select-selection-item');
    tags.forEach((tag: HTMLElement) => {
      this.tagArray.forEach(tagDef => {
        if(tag.innerHTML == tagDef.title) {
          tag.style.backgroundColor = tagDef.color; // Set the background color
        }
      })
    });
  }
}
