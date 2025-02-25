import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { title: '2DO - Home', path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
    { title: '2DO - Todos', path: 'todos', loadComponent: () => import('./components/todos/todos.component').then(m => m.TodosComponent) },
    { title: '2DO - Login', path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent), canActivate: [authGuard] },
    { title: '2DO - Signup', path: 'signup', loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent), canActivate: [authGuard] },
    { 
        title: '2DO - Dashboard', path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        children: [
            { path: '', redirectTo: 'notes', pathMatch: 'full' },
            { title: '2DO - Todos', path: 'todos', loadComponent: () => import('./components/todos/todos.component').then(m => m.TodosComponent)},
            { title: '2DO - Notes', path: 'notes', loadComponent: () => import('./components/notes/notes.component').then(m => m.NotesComponent) },
            { title: '2DO - Account', path: 'account', loadComponent: () => import('./components/account/account.component').then(m => m.AccountComponent) },
            { title: '2DO - Settings', path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent) },
        ]
    },
    { title: 'Page Not Found', path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) },
];