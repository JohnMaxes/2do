import { Routes } from '@angular/router';

export const routes: Routes = [
    { title: 'Home', path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)},
    { title: 'Todos', path: 'todos', loadComponent: () => import('./components/todos/todos.component').then(m => m.TodosComponent)},
];