import { Injectable, inject } from '@angular/core';
import { Todo } from '../model/todo.type';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TodoService {
  http = inject(HttpClient);
  fetchTodos() {
    const url = 'https://jsonplaceholder.typicode.com/todos';
    return this.http.get<Todo[]>(url);
  };
  constructor() {}
}
