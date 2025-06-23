import { Component } from '@angular/core';
import { TodoService } from '../todo.service';
import { Tag, Todo } from '../../../model/todo.type';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Add ng-zorro-antd modules
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TagColorDirective } from '../tag-color.directive';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-todo-sidebar',
  imports: [
    FormsModule, CommonModule, NzCardModule, NzButtonModule, 
    NzInputModule, NzTagModule, NzCheckboxModule, NzDividerModule,
    TagColorDirective, NzSelectComponent, NzOptionComponent
  ],
  templateUrl: './todo-sidebar.component.html',
  styleUrl: './todo-sidebar.component.css'
})
export class TodoSidebarComponent {
  selectedTodo: Todo | null = null;
  editMode = false;
  editedTodo: Todo | null = null;
  editedTagsString: string = '';
  todoTagList: Tag[] = [];

  constructor(
    private todoService: TodoService,
    private message: NzMessageService
  ) {
    this.todoService.selectedTodo$.subscribe(todo => {
      this.selectedTodo = todo;
      this.editMode = false;
      this.editedTodo = todo ? { ...todo } : null;
      this.editedTagsString = todo ? todo.tags.join(', ') : '';
      this.todoTagList = this.todoService.todoTagList;
    });
  }

  enableEdit() {
    if (this.selectedTodo) {
      this.editMode = true;
      this.editedTodo = { ...this.selectedTodo };
      this.editedTagsString = this.selectedTodo.tags.join(', ');
    }
  }

  saveEdit() {
    if (this.editedTodo) {
      this.editedTodo.tags = this.editedTagsString.split(',').map(t => t.trim()).filter(Boolean);
      this.todoService.updateTodo(this.editedTodo);
      this.editMode = false;
      this.message.success('Todo updated!');
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.editedTodo = this.selectedTodo ? { ...this.selectedTodo } : null;
    this.editedTagsString = this.selectedTodo ? this.selectedTodo.tags.join(', ') : '';
  }
}
