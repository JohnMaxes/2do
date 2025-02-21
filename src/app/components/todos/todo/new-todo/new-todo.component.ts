import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-new-todo',
  imports: [FormsModule],
  templateUrl: './new-todo.component.html',
  styleUrl: './new-todo.component.css'
})
export class NewTodoComponent {
  newTitle = '';
  newTodo = output<string>();
  
  handleEnterKey(pressedKey: KeyboardEvent) {
    if(pressedKey.key === 'Enter' && this.newTitle !== '') {
      this.newTodo.emit(this.newTitle);
    }
  }
}
