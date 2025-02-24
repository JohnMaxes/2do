import { inject, Injectable, OnInit, Signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  http = inject(HttpClient); // http request maker
  token: string = '';
  userObj: object = {};

  ngOnInit() { // == useEffect()
    localStorage.getItem('token') ? this.token = localStorage.getItem('token') || '' : this.token = '';
  }

  baseUrl: string = 'https://api.escuelajs.co/api/v1/auth';
  
  async login(email: string, password: string, signal: WritableSignal<string>): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.post<any>(`${this.baseUrl}/login`, 
        { email, password }, 
        { headers: { 'Content-Type': 'application/json' } }
      ));
      if (response.access_token) {
        this.token = response.access_token;
        localStorage.setItem('token', this.token);
        signal.set('Okay');
        return response;
      } else {
        signal.set('Wrong credentials!');
        throw new Error('Wrong credentials!');
      }
    } catch (error: any) {
      signal.set(error.message);
      throw error;
    }
  }
  
  signup(email: string, password: string, signal: WritableSignal<string>) {
    this.http.post(this.baseUrl + '/signup',
      { email, password }, 
      { headers: { 'Content-Type': 'application/json' } })
    .subscribe(
      (response: any) => {
        if (response.access_token) {
          this.token = response.access_token;
          localStorage.setItem('token', this.token);
          console.log(this.token);
        } else signal.set('Some issues');
      },
      (error) => {
        signal.set(error.message);
    });
  }

  constructor() { }
}
