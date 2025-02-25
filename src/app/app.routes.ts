import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { title: '2DO - Home', path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)}, // if you do component: HomeComponent, it will load the component immediately
    { title: '2DO - Todos', path: 'todos', loadComponent: () => import('./components/todos/todos.component').then(m => m.TodosComponent)},
    { title: '2DO - Login', path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent), canActivate: [authGuard]},
    { title: '2DO - Signup', path: 'signup', loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent), canActivate: [authGuard]},
    { 
        title: '2DO - HW', path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        children: [
            { title: '2DO - TODOS', path: 'todos', loadComponent: () => import('./components/todos/todos.component').then(m => m.TodosComponent)},]
    },
];