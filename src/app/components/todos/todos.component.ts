import { Component, inject, ElementRef, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Tag, Todo } from '../../model/todo.type';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
  NzTableSortOrder
} from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ModalComponent } from '../modal/modal.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TagColorDirective } from './tag-color.directive';
import { DatePipe } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Todo> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<Todo> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-todos',
  imports: [
    NzButtonModule, 
    NzDividerModule, 
    NzTableModule, 
    NzCheckboxModule, 
    NzInputModule, 
    FormsModule, 
    NzIconModule, 
    NzSelectModule, 
    ModalComponent,
    NzToolTipModule,
    ScrollingModule,
    NzTagModule,
    DatePipe,
    TagColorDirective,
    NzDropDownModule
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements AfterViewChecked{
  todoArray: Todo[];
  todoTagList: Tag[];
  todoArrayBackup: Todo[];
  todoBackup: any;

  constructor(private service: DashboardService, private el: ElementRef) {
    this.todoArray = this.service.todoArr;
    this.todoTagList = this.service.todoTagList;
    this.todoArrayBackup = this.todoArray;
    this.todoBackup = [];
    this.listOfTags = this.todoTagList.map(
      (index) => { return {title: index.title, checked: false}; } 
    )
  }

  ngAfterViewChecked(): void {
    const tagOptions = this.el.nativeElement.querySelectorAll('nz-option-item');
    // console.log(tagOptions);
    tagOptions.forEach((option: HTMLElement) => {
      if (option instanceof HTMLElement) {
        option.style.fontSize = '12px';
      }
    })
  }
  
  dynamicTooltipStyles: NgStyleInterface = {
    'font-size': '12px',
    'padding': '5px',
    'border': 'none',
  };

  newDate = '2025-03-05T12:34:56.789Z';

  //////////////////////////////// SELECTION  
  selectedArr: string[] = [];
  allSelected: boolean = false;
  toggleSelect(id: string) {
    if (this.selectedArr.includes(id)) {
      this.selectedArr = this.selectedArr.filter(selectedId => selectedId !== id);
    } else {
      this.selectedArr.push(id);
    }
  }
  toggleSelectAll() {
    if(this.allSelected) {
      this.selectedArr = [];
      this.allSelected = false;
    } else {
      this.todoArray.forEach(item => {
        if(!this.selectedArr.includes(item.id)) this.selectedArr.push(item.id);
      })
      this.allSelected = true;
    }
  }

  //////////////////////////////// CRUD
  showModal: boolean = false;
  modalMessage: string = '';
  handleModalResponse(res: boolean) {
    alert(res);
  }

  newTodoTitle: string = 'Lmao';
  newTodoTitleInvalid: boolean = false;
  newTodoCategory: string = '';
  newTodoTags: Tag[] = [];

  logTodos() {
    console.log(this.todoArray);
  }

  handleEnterKey(event: KeyboardEvent) {
    if(event.key == 'Enter') this.addItem();
  }
  addItem(): void {
    console.log(this.listOfTags);
    if(this.newTodoTitle == '') {
      this.newTodoTitleInvalid = true;
      setTimeout(() => {
        this.newTodoTitleInvalid = false;
      }, 2000)
    }
    else {
      this.todoArray.unshift(
        {
          id: this.newTodoTitle,
          tags: [],
          title: this.newTodoTitle,
          completed: false,
          completedOn: null,
          createdOn: new Date,
        }
      );
      //this.newTodoTitle = '';
      this.newTodoCategory = '';      
    }
  }

  deleteItem(id: string): void {
    this.todoArray = this.todoArray.filter(d => d.id !== id);
  }

  //////////////////////////////// TAG - FILTER
  listOfTags: {title: string, checked: boolean}[];

  filter() {
    const checkedTitles = this.listOfTags
      .filter(item => item.checked)
      .map(item => item.title);
    console.log(checkedTitles);

    this.todoArray = this.todoArrayBackup;
    if(checkedTitles.length == 0) return;
    else this.todoArray = this.todoArray.filter((todo) => todo.tags.some(tag => checkedTitles.includes(tag)));
  }
}
