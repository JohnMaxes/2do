import { Routes } from '@angular/router';

export const routes: Routes = [
    { title: '2DO - Home', path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)}, // if you do component: HomeComponent, it will load the component immediately
    { title: '2DO - Todos', path: 'todos', loadComponent: () => import('./components/todos/todos.component').then(m => m.TodosComponent)},
    { title: '2DO - Login', path: 'login', loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)},
    { title: '2DO - Signup', path: 'signup', loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent)},
    { 
        title: '2DO - HW', path: 'hw', loadComponent: () => import('./components/hw/hw.component').then(m => m.HwComponent),
        children: [
            { title: '2DO - TODOS', path: 'todos', loadComponent: () => import('./components/todos/todos.component').then(m => m.TodosComponent)},        ]
    },
];