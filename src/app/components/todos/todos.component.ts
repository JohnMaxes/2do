import { Component, inject, OnInit, signal, ɵisBoundToModule } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../model/todo.type';
import { TodoComponent } from '../todo/todo.component';
import { NewTodoComponent } from '../new-todo/new-todo.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-todos',
  imports: [TodoComponent, NewTodoComponent, ModalComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
  providers: [TodoService]
})
export class TodosComponent implements OnInit{
  todoService = inject(TodoService);
  todoArray = signal<Array<Todo>>([]);
  todoBackup: any;
  ngOnInit(): void {
    this.todoService
      .fetchTodos() // call to get data from FakeAPI
      .subscribe((todos) => {
        this.todoArray.set(todos)
      });
  }
  

  addingEnabled = signal(false);
  enableAdding() {
    this.addingEnabled.set(!this.addingEnabled()); // allowing the add new UI to appear/disappear
  }

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
}
