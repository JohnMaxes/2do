import { Injectable, inject } from '@angular/core';
import { Todo } from '../model/todo.type';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../model/user.type';
import { AuthService } from './auth.service';
import { Node } from '../model/note-node.type';

@Injectable()
export class DashboardService {
  auth = inject(AuthService);
  http = inject(HttpClient);
  token: string = this.auth.token;
  id = this.auth.tokenObj.sub;


  /////////// userInfo
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
    }
    catch (error: any) {
      console.error(error);
    }
  }
  /////////// userInfo
  
  /////////// Todos
  todoArr: Todo[] = [];

  async fetchTodos() {
    try {
      const url = 'https://jsonplaceholder.typicode.com/todos/';
      const response = await firstValueFrom(this.http.get<Todo[]>(url, { params: {userId: this.id} }));
      this.todoArr = response;
    }
    catch (error: any) {
      console.error(error);
    }
  };
  constructor() {}
  /////////// Todos

  /////////// Notes
  noteArr: Node [] = [
    {
      id: '1',
      name: 'Fruit',
      type: 'folder',
      createdAt: new Date(),
      updatedAt: new Date(),
      children: [
        { id: '2', name: 'Apple', type: 'folder', createdAt: new Date(), updatedAt: new Date(), children: [] },
        { id: '3', name: 'Banana', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: 'Banana content' },
        { id: '4', name: 'Fruit loops', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: 'Fruit loops content' }
      ]
    },
    {
      id: '5',
      name: 'Vegetables',
      type: 'folder',
      createdAt: new Date(),
      updatedAt: new Date(),
      children: [
        {
          id: '6',
          name: 'Green',
          type: 'notebook',
          createdAt: new Date(),
          updatedAt: new Date(),
          children: [
            { id: '7', name: 'Broccoli', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: 'Broccoli content' },
            { id: '8', name: 'Brussels sprouts', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: 'Brussels sprouts content' }
          ]
        },
        {
          id: '9',
          name: 'Orange',
          type: 'folder',
          createdAt: new Date(),
          updatedAt: new Date(),
          children: [
            { id: '10', name: 'Pumpkins', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: 'Pumpkins content' },
            { id: '11', name: 'Carrots', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: 'Carrots content' }
          ]
        }
      ]
    },
    {
      id: '12',
      name: 'Notebooks',
      type: 'notebook',
      createdAt: new Date(),
      updatedAt: new Date(),
      content: 'Notebook content',
      children: [
        { id: '13', name: 'Notebook 1', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: 'Notebook 1 content' },
        { id: '14', name: 'Notebook 2', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: 'Notebook 2 content' }
      ]
    },
    {
      id: '15',
      name: 'Notebooks',
      type: 'notebook',
      createdAt: new Date(),
      updatedAt: new Date(),
      content: 'Notebook content',
      children: [],
    }
  ];
  /////////// Notes

}
