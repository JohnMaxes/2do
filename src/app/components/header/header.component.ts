import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  auth = inject(AuthService);
  loggedIn: any;
  ngOnInit() {
    this.loggedIn = this.auth.token ? true : false
  }
}
