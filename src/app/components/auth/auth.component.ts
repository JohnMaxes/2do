import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [NzInputModule, NzButtonModule, FormsModule, NzIconModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  http = inject(HttpClient);
  auth = inject(AuthService);
  router = inject(Router);
  
  username: string = 'john@mail.com';
  password: string = 'changeme';

  loading: WritableSignal<boolean> = signal(false);

  usernameRegex = /^[a-zA-Z0-9._%+-]{3,20}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  passwordRegex = /^(?=.{8,20}$)[a-zA-Z0-9!#$%^&*]+$/;  passwordVisible: boolean = false;

  hasError: WritableSignal<string> = signal('');
  
  handleEnterKey(event: KeyboardEvent) {
    if(event.key == 'Enter') this.submitLogin();
  }

  async submitLogin() {
    this.hasError.set('');
    if (this.usernameRegex.test(this.username) == false) {
      this.hasError.set("User's fault!");
    } 
    if (!this.passwordRegex.test(this.password)) {
      this.hasError.set(" Password's fault!");
    }
    if (this.hasError() == '') {
      this.loading.set(true);
      try {
        await this.auth.login(this.username, this.password, this.hasError);
        if(this.hasError() == 'Okay') {
          this.router.navigate(['/']);
        }
      } catch (error: any) {
        this.hasError.set(error.message);
      } finally {
        this.loading.set(false);
      }
    }
  }
}