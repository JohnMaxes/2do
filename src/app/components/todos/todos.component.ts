import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Todo } from '../../model/todo.type';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-todos',
  imports: [NzButtonModule, NzDividerModule, NzTableModule, NzCheckboxModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
  providers: [DashboardService]
})
export class TodosComponent implements OnInit{
  service = inject(DashboardService);
  todoArray = <Array<Todo>>([]);
  todoBackup: any;

  async ngOnInit() {
    if(this.service.todoArr.length === 0) {
      await this.service.fetchTodos();
    }
    if(this.todoArray.length === 0) {
    this.todoArray = this.service.todoArr;
    }
  }
  

  addingEnabled = signal(false);
  enableAdding() {
    this.addingEnabled.set(!this.addingEnabled());
  }

  
  /*
  updateTodoItem(todoItem: Todo) {
    console.log(todoItem);
    this.todoArray.update((todos) => {
      return todos.map(todo => {
        if(todo.id === todoItem.id) {
          return {...todo, completed: !todoItem.completed}
        }
        return todo;
      })
    })
  }



  addTodoItem(newTitle: string) {
    this.todoArray.update(todos => {
      let maxIndex = todos[todos.length - 1].id;
      todos.unshift({title: newTitle, id: maxIndex + 2, userId: 0, completed: false});
      this.addingEnabled.set(false);
      return todos;
    })
  }
  

  todoCompletedToggled = false;
  toggleCompletedTodos() {
    if (this.todoCompletedToggled === false) {
      this.todoBackup = signal<Todo[]>(this.todoArray());
      this.todoArray.update(todos => {
        return todos.filter(todo => !todo.completed);
      });
    } else {
      this.todoArray.set(this.todoBackup());
    }
    this.todoCompletedToggled = !this.todoCompletedToggled;
  }
  
  @if(deleteModalShown) {<app-modal [message]="modalMessage" (response)="handleModalResponse($event)"></app-modal>}
  deleteModalShown = false;
  modalMessage = 'Are you sure you want to delete the completed todos permanently?'
  initDeleteCompleted() {
    this.deleteModalShown = true;
  }
  handleModalResponse(result: boolean) {
    this.deleteModalShown = false;
    if(result) {
      this.todoArray.update(todos => {
        return todos.filter(todo => !todo.completed);
      })
      this.todoBackup.set(this.todoArray());
    }
  }
  */
}
