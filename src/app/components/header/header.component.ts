import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit {
  loggedIn: boolean = false;
  constructor(private auth: AuthService) {}
  ngAfterViewInit(): void {
    this.loggedIn = this.auth.token !== '' ? true : false
    console.log('header init');
  }
}
