import { Injectable, inject } from '@angular/core';
import { Tag, Todo } from '../model/todo.type';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../model/user.type';
import { AuthService } from './auth.service';
import { Node } from '../model/node.type';

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
  todoArr: Todo[] = [
    {
      id: '1',
      tags: ['Shopping'],
      title: 'Buy groceries',
      completed: false,
      createdOn: new Date('2023-01-01'),
      completedOn: null,
    },
    {
      id: '2',
      tags: ['Personal'],
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
      tags: ['Finance'],
      title: 'Call the bank',
      completed: true,
      createdOn: new Date('2023-01-05'),
      completedOn: new Date('2023-01-06'),
    },
    {
      id: '5',
      tags: ['Household'],
      title: 'Clean the house',
      completed: false,
      createdOn: new Date('2023-01-07'),
      completedOn: null,
    },
    {
      id: '6',
      tags: ['Fitness'],
      title: 'Go for a run',
      completed: true,
      createdOn: new Date('2023-01-08'),
      completedOn: new Date('2023-01-09'),
    },
    {
      id: '7',
      tags: ['Education'],
      title: 'Read a book',
      completed: false,
      createdOn: new Date('2023-01-10'),
      completedOn: null,
    },
  ];

  todoTagList: Tag[] = [
    { title: 'Shopping', color: '#FF5733' },
    { title: 'Personal', color: '#33FF57' },
    { title: 'Work', color: '#3357FF' },
    { title: 'Finance', color: '#FF33A1' },
    { title: 'Household', color: '#FF8C33' },
    { title: 'Fitness', color: '#33FFF5' },
    { title: 'Education', color: '#FF33D4' },
  ];

  /*
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
  */
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
