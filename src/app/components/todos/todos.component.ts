import { Component } from '@angular/core';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoSidebarComponent } from './todo-sidebar/todo-sidebar.component';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    NzSplitterModule,
    TodoListComponent,
    TodoSidebarComponent
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent {}
import { TagColorDirective } from './tag-color.directive';
import { DatePipe } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { TodoSidebarComponent } from './todo-sidebar/todo-sidebar.component';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';

@Component({
  selector: 'app-todos',
  imports: [
    NzButtonModule, NzDividerModule, NzTableModule, 
    NzCheckboxModule, NzInputModule, FormsModule, 
    NzIconModule, NzSelectModule, ModalComponent,
    NzToolTipModule, ScrollingModule, NzTagModule,
    DatePipe, TagColorDirective, NzDropDownModule,
    TodoSidebarComponent, NzSplitterModule,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements AfterViewChecked{
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
    this.todoTagList = this.dashboardService.todoTagList;
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
