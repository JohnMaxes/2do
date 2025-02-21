import { Routes } from '@angular/router';

export const routes: Routes = [
    { title: '2DO - Home', path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)},
    { title: '2DO - Todos', path: 'todos', loadComponent: () => import('./components/todos/todos.component').then(m => m.TodosComponent)},
    { title: '2DO - Login', path: 'login', loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)}
];