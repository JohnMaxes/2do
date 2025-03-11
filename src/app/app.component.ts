import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FormsModule],
  template: `
    <app-header/>
    <router-outlet/>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  ngOnInit(): void {
    this.auth.initialize();
  }
}