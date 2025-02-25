import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  ngOnInit(): void {
    this.auth.initialize();
  }
}

/*
<div class="todoFunctions">
  <button class="add-button" (click)="enableAdding()">@if(addingEnabled()){Cancel}@else{Add Todo}</button>
  <button class="toggle-button" (click)="toggleCompletedTodos()">Toggle Completed Todos</button>
  <button class="delete-button" (click)="initDeleteCompleted()">Delete Completed Todos</button>
</div>
*/