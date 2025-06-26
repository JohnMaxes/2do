import { Component, ElementRef, AfterViewChecked, ViewChild } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { TodoService } from '../todo.service';
import { Tag, Todo } from '../../../model/todo.type';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TagColorDirective } from '../tag-color.directive';
import { DatePipe } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-todo-table',
  imports: [
    NzToolTipModule, ScrollingModule, NzTagModule,
    DatePipe, TagColorDirective, NzDropDownModule,
    NzButtonModule, NzDividerModule, NzTableModule, 
    NzCheckboxModule, NzInputModule, FormsModule, 
    NzIconModule, NzSelectModule
  ],
  templateUrl: './todo-table.component.html',
  styleUrl: './todo-table.component.css'
})
export class TodoTableComponent {
  todoArray: Todo[] = [];
  todoTagList: Tag[];
  todoArrayBackup: Todo[] = [];
  todoBackup: any;

  selectedTodoId: string | null = null;

  constructor( 
    private dashboardService: DashboardService,
    private el: ElementRef,
    private todoService: TodoService
   ) {
    // Use TodoService for todos
    this.todoTagList = todoService.todoTagList;
    this.todoService.todos$.subscribe(todos => {
      this.todoArray = todos;
      this.todoArrayBackup = todos;
    });
    this.todoService.selectedTodo$.subscribe(todo => {
      this.selectedTodoId = todo?.id ?? null;
    });
    this.listOfTags = this.todoTagList.map(
      (index) => { return {title: index.title, checked: false}; } 
    )
  }

  @ViewChild('todoDiv') todoDiv!: ElementRef<HTMLDivElement>;
  divHeight!: string;
  getDivHeight(): string {
    if (this.todoDiv && this.todoDiv.nativeElement) {
      let viewportHeight;
      if (typeof window !== 'undefined') {
        viewportHeight = window.innerHeight;
      }
      const divElement = this.todoDiv.nativeElement;
      const heightInPixels = divElement.offsetHeight;
      const heightInVh = (heightInPixels / (viewportHeight ? viewportHeight : 70.42)) * 100;
      return `${heightInVh.toFixed(2)}vh`;
    }
    return '70.42vh';
  }

  ngAfterViewInit(): void {
    this.divHeight = this.getDivHeight();
    console.log(this.divHeight);
  }

  ngAfterViewChecked(): void {
    const tagOptions = this.el.nativeElement.querySelectorAll('nz-option-item');
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
    if (this.newTodoTitle == '') {
      this.newTodoTitleInvalid = true;
      setTimeout(() => {
        this.newTodoTitleInvalid = false;
      }, 2000)
    } else {
      const newTodo: Todo = {
        id: this.newTodoTitle,
        tags: [],
        title: this.newTodoTitle,
        completed: false,
        completedOn: null,
        createdOn: new Date(),
      };
      this.todoService.addTodo(newTodo);
      //this.newTodoTitle = '';
      this.newTodoCategory = '';      
    }
  }

  // Selection logic for sidebar
  onRowClick(todo: Todo) {
    this.todoService.selectTodo(todo);
  }

  deleteItem(id: string): void {
    this.todoService.deleteTodo(id);
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
