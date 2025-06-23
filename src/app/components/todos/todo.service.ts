import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo, Tag } from '../../model/todo.type';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>(
  [
    {
      id: '1',
      tags: ['Shopping', 'Personal'],
      title: 'Buy groceries',
      completed: false,
      createdOn: new Date('2023-01-01'),
      completedOn: null,
      description: 'This is beyond me and you!',
    },
    {
      id: '2',
      tags: ['Personal', ],
      title: 'Walk the dog',
      completed: true,
      createdOn: new Date('2023-01-02'),
      completedOn: new Date('2023-01-03'),
    },
    {
      id: '3',
      tags: ['Work'],
      title: 'Finish project report',
      completed: false,
      createdOn: new Date('2023-01-04'),
      completedOn: null,
    },
    {
      id: '4',
      tags: ['Finance', 'Work'],
      title: 'Call the bank',
      completed: true,
      createdOn: new Date('2023-01-05'),
      completedOn: new Date('2023-01-06'),
    },
    {
      id: '5',
      tags: ['Household', 'Personal'],
      title: 'Clean the house',
      completed: false,
      createdOn: new Date('2023-01-07'),
      completedOn: null,
    },
    {
      id: '6',
      tags: ['Fitness', 'Personal'],
      title: 'Go for a run',
      completed: true,
      createdOn: new Date('2023-01-08'),
      completedOn: new Date('2023-01-09'),
    },
    {
      id: '7',
      tags: ['Education', 'Personal'],
      title: 'Read a book',
      completed: false,
      createdOn: new Date('2023-01-10'),
      completedOn: null,
    },
    ]
  );

  todoTagList: Tag[] = [
    { title: 'Shopping', color: '#FF5733' },
    { title: 'Personal', color: '#33FF57' },
    { title: 'Work', color: '#3357FF' },
    { title: 'Finance', color: '#FF33A1' },
    { title: 'Household', color: '#FF8C33' },
    { title: 'Fitness', color: '#33FFF5' },
    { title: 'Education', color: '#FF33D4' },
  ];

  todos$ = this.todosSubject.asObservable();

  private selectedTodoSubject = new BehaviorSubject<Todo | null>(null);
  selectedTodo$ = this.selectedTodoSubject.asObservable();

  constructor() {}

  getTodos(): Todo[] {
    return this.todosSubject.getValue();
  }

  setTodos(todos: Todo[]) {
    this.todosSubject.next(todos);
  }

  addTodo(todo: Todo) {
    const todos = [todo, ...this.getTodos()];
    this.todosSubject.next(todos);
  }

  updateTodo(updated: Todo) {
    const todos = this.getTodos().map(t => t.id === updated.id ? updated : t);
    this.todosSubject.next(todos);
    // If the updated todo is selected, update it as well
    if (this.selectedTodoSubject.getValue()?.id === updated.id) {
      this.selectedTodoSubject.next(updated);
    }
  }

  deleteTodo(id: string) {
    const todos = this.getTodos().filter(t => t.id !== id);
    this.todosSubject.next(todos);
    if (this.selectedTodoSubject.getValue()?.id === id) {
      this.selectedTodoSubject.next(null);
    }
  }

  selectTodo(todo: Todo | null) {
    this.selectedTodoSubject.next(todo);
  }
}
