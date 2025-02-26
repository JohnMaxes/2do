import { Injectable, inject } from '@angular/core';
import { Todo } from '../model/todo.type';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../model/user.type';
import { AuthService } from './auth.service';

@Injectable()
export class DashboardService {
  auth = inject(AuthService);
  http = inject(HttpClient);
  token: string = this.auth.token;
  id = this.auth.tokenObj.sub;
  todoArr: Todo[] = [];
  userInfo: User = {
    id: 0,
    email: '',
    password: '',
    name: '',
    role: '',
    avatar: '',
    creationAt: '',
    updatedAt: '',
  };

  async getUserInfo() {
    if(this.userInfo.id) return;
    try {
      const response = await firstValueFrom(this.http.get<User>(`https://api.escuelajs.co/api/v1/auth/profile`, 
        { headers: { 'Authorization': `Bearer ${this.token}` } }
      ));
      this.userInfo = response;
      console.log(this.userInfo);
    } catch (error: any) {
      console.log(error.message);
      throw error;
    }
  }

  async fetchTodos() {
    try {
      const url = 'https://jsonplaceholder.typicode.com/todos/';
      const response = await firstValueFrom(this.http.get<Todo[]>(url, { params: {userId: this.id} }));
      this.todoArr = response;
      console.log(response);
    }
    catch (error: any) {
      console.error(error);
    }
  };
  constructor() {}
}
