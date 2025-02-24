import { Component, inject, WritableSignal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [NzInputModule, NzButtonModule, FormsModule, NzIconModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  http = inject(HttpClient);
  auth = inject(AuthService);

  username: string = 'john@mail.com';
  email: string = 'johndoe@mail.com';
  password: string = 'changeme';
  repeatPassword: string = 'changeme';

  loading = false;

  passwordVisible: boolean = false;
  repeatPasswordVisible: boolean = false;
  usernameRegex = /^[a-zA-Z0-9._%+-]{3,20}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  passwordRegex = /^(?=.{8,20}$)[a-zA-Z0-9!#$%^&*]+$/;  
  emailRegex = /^[a-zA-Z0-9._%+-]{3,20}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  hasError: WritableSignal<string> = signal('');
  handleEnterKey(event: KeyboardEvent) {
    if(event.key == 'Enter') this.submitSignup();
  }
  submitSignup() { // has same logic as login since there's no reliable way to test the signup
    this.hasError.set('');
    if (!this.usernameRegex.test(this.username)) {
      this.hasError.set("User's fault!");
    } 
    if (!this.passwordRegex.test(this.password)) {
      this.hasError.set(" Password's fault!");
    }
    if (this.password != this.repeatPassword) { 
      this.hasError.set("Passwords don't match!");
    }
    if (this.hasError() == '') { // if there's no error
      this.loading = true;
      this.auth.signup(this.email, this.password, this.hasError);
      this.loading = false;
      }
  }
}