import { Component, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Tag, Todo } from '../../model/todo.type';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ModalComponent } from '../modal/modal.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { NgStyle } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TagColorDirective } from './tag-color.directive';
//import { DatePipe } from '@angular/common';


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
    //TagColorDirective,
    //DatePipe,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
  providers: [DashboardService]
})
export class TodosComponent{
  service = inject(DashboardService);
  todoArray: Todo[] = this.service.todoArr;
  todoTagList: Tag[] = this.service.todoTagList;
  todoBackup: any;

  dynamicStyles: NgStyleInterface = {
    'font-size': '12px',
    'padding': '5px',
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

  newTodoTitle: string = '';
  newTodoCategory: string = '';
  newTodoTags: Tag[] = [];

  logTodos() {
    console.log(this.todoArray);
  }

  handleEnterKey(event: KeyboardEvent) {
    if(event.key == 'Enter') this.addItem();
  }
  addItem(): void {
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
    this.newTodoTitle = '';
    this.newTodoCategory = '';
  }

  deleteItem(id: string): void {
    this.todoArray = this.todoArray.filter(d => d.id !== id);
  }
}
