import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  loggedIn: boolean;
  constructor(private auth: AuthService) {
    this.loggedIn = this.auth.token !== '' ? true : false
  }
}
