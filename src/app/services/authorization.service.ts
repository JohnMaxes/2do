import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  http = inject(HttpClient);
  login(username: string, password: string) {
    const url = 'https://api.escuelajs.co/api/v1/auth/login';
    return this.http.post(url, { email: username, password }, { headers: { 'Content-Type': 'application/json' } });
  }
}
