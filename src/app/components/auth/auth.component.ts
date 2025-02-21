import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthorizationService } from '../../services/authorization.service';
import { response } from 'express';


@Component({
  selector: 'app-auth',
  imports: [NzInputModule, NzButtonModule, FormsModule, NzIconModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  http = inject(AuthorizationService);
  username: string = 'john@mail.com';
  password: string = 'changeme';

  loading = false;

  usernameRegex = /^[a-zA-Z0-9._%+-]{3,20}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  passwordRegex = /^(?=.{8,20}$)[a-zA-Z0-9!#$%^&*]+$/;  passwordVisible: boolean = false;

  hasError: string = '';
  handleEnterKey(event: KeyboardEvent) {
    if(event.key == 'Enter') this.submitLogin();
  }
  submitLogin() {
    this.hasError = '';
    if (this.usernameRegex.test(this.username) == false) {
      this.hasError = "User's fault!";
    } 
    if (!this.passwordRegex.test(this.password)) {
      this.hasError += " Password's fault!";
    }
    if (this.hasError == '') {
      this.loading = true;
      this.http.login(this.username, this.password).subscribe({
        next: response => {
          console.log('Server response:', response);
        },
        error: error => {
          console.error('Server error:', error);
          this.loading = false;
        }
      });
    }
  }
}